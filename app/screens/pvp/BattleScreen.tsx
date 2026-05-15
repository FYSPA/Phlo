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
    const [p1Score, setP1Score] = useState(0);
    const [p2Score, setP2Score] = useState(0);
    const [currentCode, setCurrentCode] = useState('');
    const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
    const [isRoundActive, setIsRoundActive] = useState(false);
    const [roundResult, setRoundResult] = useState<'win' | 'lose' | 'tie' | null>(null);
    const [showResultModal, setShowResultModal] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [rewards, setRewards] = useState({ xp: 0, gems: 0, leaguePoints: 0 });
    const [newLeague, setNewLeague] = useState<LeagueTier>(getLeagueTier(leaguePoints));

    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const roundActiveRef = useRef(false);
    const matchCreatedRef = useRef(false);
    const botRespondedRef = useRef(false);
    const hasUserCheckedRef = useRef(false);

    const { generateResponse, isThinking, reset } = useAIBot(leaguePoints);

    useEffect(() => {
        initBattle();
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const initBattle = async () => {
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
        if (currentRoundIndex >= exercises.length) {
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
    }, [currentRoundIndex, exercises]);

    useEffect(() => {
        if (exercises.length > 0 && !isRoundActive && !isGameOver && matchCreatedRef.current) {
            const timer = setTimeout(startRound, 500);
            return () => clearTimeout(timer);
        }
    }, [exercises, isRoundActive, isGameOver, startRound]);

    const handleUserCodeChange = useCallback((code: string) => {
        if (!roundActiveRef.current) return;
        setCurrentCode(code);
    }, []);

    const handleCheck = useCallback(() => {
        console.log('[DEBUG] handleCheck llamado');
        console.log('[DEBUG] roundActiveRef:', roundActiveRef.current);
        console.log('[DEBUG] hasUserCheckedRef:', hasUserCheckedRef.current);
        
        if (!roundActiveRef.current || hasUserCheckedRef.current) {
            console.log('[DEBUG] handleCheck: early return');
            return;
        }

        if (!currentCode || currentCode.trim() === '' || currentCode === '__INVALID_CODE__') {
            console.log('[DEBUG] handleCheck: código vacío');
            return;
        }

        hasUserCheckedRef.current = true;
        console.log('[DEBUG] Usuario falló, iniciando bot...');

        if (timerRef.current) clearInterval(timerRef.current);

        const { isCorrect } = validateSolutionWithFeedback(currentCode, exercises[currentRoundIndex]?.solution_js || '');
        console.log('[DEBUG] isCorrect:', isCorrect);

        if (isCorrect) {
            handleRoundEnd('win');
        } else {
            console.log('[DEBUG] Llamando startBotThinking');
            startBotThinking();
        }
    }, [currentCode, currentRoundIndex, exercises]);

    const startBotThinking = () => {
        console.log('[DEBUG] startBotThinking iniciado');
        if (botRespondedRef.current) {
            console.log('[DEBUG] botRespondedRef ya es true, returning');
            return;
        }
        botRespondedRef.current = true;
        console.log('[DEBUG] Llamando generateResponse...');

        generateResponse().then(response => {
            console.log('[DEBUG] Bot respondió:', response);
            if (response.isCorrect) {
                handleRoundEnd('lose');
            } else {
                handleRoundEnd('tie');
            }
        });
    };

    const handleTimeout = () => {
        if (!roundActiveRef.current) return;
        setIsRoundActive(false);
        roundActiveRef.current = false;

        if (!hasUserCheckedRef.current) {
            handleRoundEnd('tie');
        } else {
            startBotThinking();
        }
    };

    const handleRoundEnd = (result: 'win' | 'lose' | 'tie') => {
        setIsRoundActive(false);
        roundActiveRef.current = false;

        let newP1Score = p1Score;
        let newP2Score = p2Score;

        if (result === 'win') {
            newP1Score = p1Score + 1;
            setP1Score(newP1Score);
        } else if (result === 'lose') {
            newP2Score = p2Score + 1;
            setP2Score(newP2Score);
        }

        setRoundResult(result);

        setTimeout(() => {
            setRoundResult(null);
            if (newP1Score >= ROUNDS_TO_WIN || newP2Score >= ROUNDS_TO_WIN || currentRoundIndex + 1 >= MAX_ROUNDS) {
                endBattle();
            } else {
                setCurrentRoundIndex(prev => prev + 1);
            }
        }, 2000);
    };

    const endBattle = () => {
        setIsGameOver(true);
        if (timerRef.current) clearInterval(timerRef.current);

        const isVictory = p1Score > p2Score;
        const isTie = p1Score === p2Score;
        const calculatedRewards = calculateRewards(p1Score, p2Score, true);

        setRewards(calculatedRewards);

        const newLeaguePoints = Math.max(0, leaguePoints + calculatedRewards.leaguePoints);
        const newTier = getLeagueTier(newLeaguePoints);

        setNewLeague(newTier);

        updatePlayerStats(calculatedRewards.xp, calculatedRewards.gems, calculatedRewards.leaguePoints);

        setShowResultModal(true);
    };

    const updatePlayerStats = async (xpEarned: number, gemsEarned: number, leaguePointsEarned: number) => {
        const { data: profile } = await supabase
            .from('profiles')
            .select('xp, gems, league_points')
            .eq('id', userId)
            .single();

        if (!profile) return;

        await supabase
            .from('profiles')
            .update({
                xp: profile.xp + xpEarned,
                gems: profile.gems + gemsEarned,
                league_points: Math.max(0, profile.league_points + leaguePointsEarned),
            })
            .eq('id', userId);
    };

    const handlePlayAgain = () => {
        setShowResultModal(false);
        setP1Score(0);
        setP2Score(0);
        setCurrentRoundIndex(0);
        setIsGameOver(false);
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

    const currentExercise = exercises[currentRoundIndex];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.timerBar}>
                <Text style={styles.timerText}>{timeLeft}s</Text>
            </View>

            <PlayerProgress
                p1Score={p1Score}
                p2Score={p2Score}
                currentRound={currentRoundIndex + 1}
            />

            <BattleArena
                instruction={currentExercise?.instruction || 'Cargando...'}
                toolboxConfig={currentExercise?.toolbox_config}
                currentCode={currentCode}
                onCodeChange={handleUserCodeChange}
                onCheck={handleCheck}
                botThinking={isThinking && roundActiveRef.current}
                canCheck={isRoundActive && !hasUserCheckedRef.current}
            />

            <RoundResult result={roundResult} onComplete={() => {}} />

            <BattleResultModal
                visible={showResultModal}
                isVictory={p1Score > p2Score}
                isTie={p1Score === p2Score}
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