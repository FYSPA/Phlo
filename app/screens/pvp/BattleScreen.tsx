import { useRouter } from 'expo-router';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BattleArena from '../../../components/pvp/BattleArena';
import BattleResultModal from '../../../components/pvp/BattleResultModal';
import PlayerProgress from '../../../components/pvp/PlayerProgress';
import RoundResult from '../../../components/pvp/RoundResult';
import { useAIBot } from '../../../hooks/useAIBot';
import { supabase } from '../../../src/services/supabase';
import { validateSolutionWithFeedback } from '../../../src/utils/codeUtils';
import { calculateRewards, getLeagueTier } from '../../../src/utils/pvpUtils';
import { Exercise, LeagueTier } from '../../../src/types/pvp';

interface Props {
    userId: string;
    leaguePoints: number;
}

const ROUND_TIME = 30;
const ROUNDS_TO_WIN = 3;
const MAX_ROUNDS = 5;

export default function BattleScreen({ userId, leaguePoints }: Props) {
    const router = useRouter();
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
    const [currentCode, setCurrentCode] = useState('');
    const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
    const [isRoundActive, setIsRoundActive] = useState(false);
    const [roundResult, setRoundResult] = useState<'win' | 'lose' | 'tie' | null>(null);
    const [showResultModal, setShowResultModal] = useState(false);
    const [rewards, setRewards] = useState({ xp: 0, gems: 0, leaguePoints: 0 });
    const [newLeague, setNewLeague] = useState<LeagueTier>(getLeagueTier(leaguePoints));
    const [battleEnded, setBattleEnded] = useState(false);

    const p1ScoreRef = useRef(0);
    const p2ScoreRef = useRef(0);
    const [p1ScoreDisplay, setP1ScoreDisplay] = useState(0);
    const [p2ScoreDisplay, setP2ScoreDisplay] = useState(0);

    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const roundActiveRef = useRef(false);
    const matchCreatedRef = useRef(false);
    const botRespondedRef = useRef(false);
    const hasUserCheckedRef = useRef(false);
    const roundIndexRef = useRef(0);
    const battleEndedRef = useRef(false);

    const { generateResponse, isThinking, reset } = useAIBot(leaguePoints);

    useEffect(() => {
        initBattle();
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const initBattle = async () => {
        p1ScoreRef.current = 0;
        p2ScoreRef.current = 0;
        roundIndexRef.current = 0;
        battleEndedRef.current = false;
        setP1ScoreDisplay(0);
        setP2ScoreDisplay(0);
        setCurrentRoundIndex(0);
        setBattleEnded(false);

        const exercisesData = await loadRandomExercises();
        if (exercisesData.length === 0) {
            router.back();
            return;
        }
        setExercises(exercisesData);
        matchCreatedRef.current = true;
    };

    const loadRandomExercises = async () => {
        const { data } = await supabase
            .from('exercises')
            .select('*')
            .limit(MAX_ROUNDS);
        return data || [];
    };

    const startRound = useCallback(() => {
        if (battleEndedRef.current) return;

        const currentIdx = roundIndexRef.current;
        if (currentIdx >= exercises.length) {
            endBattle();
            return;
        }

        setCurrentCode('');
        setTimeLeft(ROUND_TIME);
        setIsRoundActive(true);
        roundActiveRef.current = true;
        hasUserCheckedRef.current = false;
        botRespondedRef.current = false;
        reset();

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    if (timerRef.current) clearInterval(timerRef.current);
                    handleTimeout();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, [exercises]);

    useEffect(() => {
        if (exercises.length > 0 && !isRoundActive && !battleEnded && matchCreatedRef.current) {
            const timer = setTimeout(startRound, 500);
            return () => clearTimeout(timer);
        }
    }, [exercises, isRoundActive, battleEnded, startRound]);

    const handleUserCodeChange = useCallback((code: string) => {
        if (!roundActiveRef.current) return;
        setCurrentCode(code);
    }, []);

    const handleCheck = useCallback(() => {
        if (!roundActiveRef.current || hasUserCheckedRef.current || battleEndedRef.current) return;

        if (!currentCode || currentCode.trim() === '' || currentCode === '__INVALID_CODE__') return;

        hasUserCheckedRef.current = true;

        if (timerRef.current) clearInterval(timerRef.current);

        const { isCorrect } = validateSolutionWithFeedback(currentCode, exercises[roundIndexRef.current]?.solution_js || '');

        if (isCorrect) {
            handleRoundEnd('win');
        } else {
            startBotThinking();
        }
    }, [currentCode, exercises]);

    const startBotThinking = useCallback(() => {
        if (botRespondedRef.current || battleEndedRef.current) return;
        botRespondedRef.current = true;

        generateResponse().then(response => {
            if (response.isCorrect) {
                handleRoundEnd('lose');
            } else {
                handleRoundEnd('tie');
            }
        });
    }, [generateResponse]);

    const handleTimeout = useCallback(() => {
        if (!roundActiveRef.current || battleEndedRef.current) return;
        setIsRoundActive(false);
        roundActiveRef.current = false;

        if (!hasUserCheckedRef.current) {
            handleRoundEnd('tie');
        } else {
            startBotThinking();
        }
    }, [startBotThinking]);

    const handleRoundEnd = useCallback((result: 'win' | 'lose' | 'tie') => {
        if (battleEndedRef.current) return;

        setIsRoundActive(false);
        roundActiveRef.current = false;
        setRoundResult(result);

        if (result === 'win') {
            p1ScoreRef.current += 1;
            setP1ScoreDisplay(p1ScoreRef.current);
        } else if (result === 'lose') {
            p2ScoreRef.current += 1;
            setP2ScoreDisplay(p2ScoreRef.current);
        }

        if (p1ScoreRef.current >= ROUNDS_TO_WIN || p2ScoreRef.current >= ROUNDS_TO_WIN) {
            setTimeout(endBattle, 1500);
        } else if (roundIndexRef.current + 1 >= MAX_ROUNDS) {
            setTimeout(endBattle, 1500);
        } else {
            setTimeout(() => {
                if (battleEndedRef.current) return;
                setRoundResult(null);
                roundIndexRef.current += 1;
                setCurrentRoundIndex(roundIndexRef.current);
            }, 2000);
        }
    }, [startBotThinking]);

    const endBattle = useCallback(() => {
        if (battleEndedRef.current) return;
        battleEndedRef.current = true;
        setBattleEnded(true);

        if (timerRef.current) clearInterval(timerRef.current);

        const isVictory = p1ScoreRef.current > p2ScoreRef.current;
        const calculatedRewards = calculateRewards(p1ScoreRef.current, p2ScoreRef.current, true);

        setRewards(calculatedRewards);

        const newLeaguePoints = Math.max(0, leaguePoints + calculatedRewards.leaguePoints);
        const newTier = getLeagueTier(newLeaguePoints);

        setNewLeague(newTier);

        updatePlayerStats(calculatedRewards.xp, calculatedRewards.gems, calculatedRewards.leaguePoints);

        setShowResultModal(true);
    }, [leaguePoints]);

    const updatePlayerStats = async (xpEarned: number, gemsEarned: number, leaguePointsEarned: number) => {
        try {
            const { data: profile } = await supabase
                .from('profiles')
                .select('xp, gems, league_points')
                .eq('id', userId)
                .single();

            if (!profile) return;

            const newXp = (profile.xp || 0) + xpEarned;
            const newGems = (profile.gems || 0) + gemsEarned;
            const newLeaguePts = Math.max(0, (profile.league_points || 0) + leaguePointsEarned);

            const { error } = await supabase
                .from('profiles')
                .update({
                    xp: newXp,
                    gems: newGems,
                    league_points: newLeaguePts,
                })
                .eq('id', userId);

            if (error) console.error('Error updating stats:', error);
        } catch (e) {
            console.error('Error in updatePlayerStats:', e);
        }
    };

    const handlePlayAgain = () => {
        setShowResultModal(false);
        initBattle();
    };

    const handleExit = () => {
        setShowResultModal(false);
        router.replace('/(tabs)/pvp');
    };

    if (exercises.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color="#FF0055" />
                </View>
            </SafeAreaView>
        );
    }

    const currentExercise = exercises[roundIndexRef.current];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.timerBar}>
                <Text style={styles.timerText}>{timeLeft}s</Text>
            </View>

            <PlayerProgress
                p1Score={p1ScoreDisplay}
                p2Score={p2ScoreDisplay}
                currentRound={roundIndexRef.current + 1}
            />

            <BattleArena
                instruction={currentExercise?.instruction || 'Cargando...'}
                toolboxConfig={currentExercise?.toolbox_config}
                currentCode={currentCode}
                onCodeChange={handleUserCodeChange}
                onCheck={handleCheck}
                botThinking={isThinking && roundActiveRef.current}
                canCheck={isRoundActive && !hasUserCheckedRef.current && !battleEnded}
            />

            <RoundResult result={roundResult} onComplete={() => {}} />

            <BattleResultModal
                visible={showResultModal}
                isVictory={p1ScoreDisplay > p2ScoreDisplay}
                isTie={p1ScoreDisplay === p2ScoreDisplay}
                xpEarned={rewards.xp}
                gemsEarned={rewards.gems}
                leaguePointsEarned={rewards.leaguePoints}
                newLeague={newLeague}
                onPlayAgain={handlePlayAgain}
                onExit={handleExit}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    loading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    timerBar: {
        backgroundColor: '#FF0055',
        paddingVertical: 8,
        alignItems: 'center',
    },
    timerText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '900',
    },
});