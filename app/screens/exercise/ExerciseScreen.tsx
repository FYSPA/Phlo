import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { useSharedValue, withSpring } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import ExerciseContent from '../../../components/exercise/ExerciseContent';
import ExerciseHeader from '../../../components/exercise/ExerciseHeader';
import ExerciseToolbar from '../../../components/exercise/ExerciseToolbar';
import GameOverModal from '../../../components/exercise/GameOverModal';
import NextExerciseModal from '../../../components/exercise/NextExerciseModal';
import SuccessModal from '../../../components/exercise/SuccessModal';
import CheckFooter from '../../../components/exercise/CheckFooter';
import { useExerciseState } from '../../../hooks/useExerciseState';
import { useLives } from '../../../hooks/useLives';
import { courseService } from '../../../src/services/courseService';
import { exerciseService } from '../../../src/services/exerciseService';
import { validateSolutionWithFeedback } from '../../../src/utils/codeUtils';

export default function ExerciseScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [showCode, setShowCode] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showNextExercise, setShowNextExercise] = useState(false);
    const [showGameOver, setShowGameOver] = useState(false);

    const { lives, loseLife, reset: resetLives } = useLives(5);
    const { exercises, currentIndex, currentCode, setCurrentCode, loadExercises, advanceToNext, reset: resetExercises } = useExerciseState(id as string);
    const progressWidth = useSharedValue(0);

    const exercise = exercises[currentIndex];

    useEffect(() => {
        if (exercises.length > 0) {
            progressWidth.value = withSpring(((currentIndex + 1) / exercises.length) * 100, { damping: 15 });
        }
    }, [currentIndex, exercises.length]);

    useEffect(() => {
        loadExercises();
    }, [id]);

    useEffect(() => {
        return () => {
            resetLives();
        };
    }, []);

    if (!exercise) return <ActivityIndicator />;

    const handleCodeChange = (code: string) => {
        setCurrentCode(code);
    };

    const checkSolution = async () => {
        if (!currentCode || currentCode === '__INVALID_CODE__' || currentCode.trim() === '') {
            Alert.alert('¡Casi!', 'Conecta los bloques antes de comprobar.');
            return;
        }

        const { isCorrect, errorMessage } = validateSolutionWithFeedback(currentCode, exercise.solution_js);

        if (isCorrect) {
            if (currentIndex < exercises.length - 1) {
                setShowNextExercise(true);
            } else {
                await exerciseService.completeLevel(id as string, 10, 2);
                setShowSuccess(true);
            }
        } else {
            loseLife();
            if (lives <= 1) {
                setShowGameOver(true);
            } else {
                Alert.alert('INTENTA DE NUEVO', errorMessage || 'Los bloques no están en el orden correcto.');
            }
        }
    };

    const handleNextExercise = () => {
        setShowNextExercise(false);
        advanceToNext();
    };

    const handleRetry = () => {
        setShowGameOver(false);
        resetLives();
        resetExercises();
    };

    return (
        <SafeAreaView style={styles.container}>
            <ExerciseHeader
                lives={lives}
                progress={exercises.length > 0 ? (currentIndex / exercises.length) * 100 : 0}
                instruction={exercise.instruction}
                onClose={() => router.back()}
            />

            <View style={styles.toolbar}>
                <ExerciseToolbar showCode={showCode} onToggle={() => setShowCode(!showCode)} />
            </View>

            <ExerciseContent
                showCode={showCode}
                currentCode={currentCode}
                toolboxConfig={exercise.toolbox_config}
                onCodeChange={handleCodeChange}
            />

            <CheckFooter lives={lives} onCheck={checkSolution} />

            <SuccessModal
                visible={showSuccess}
                onNext={() => {
                    setShowSuccess(false);
                    router.replace('/(tabs)/home');
                }}
                onNextLevel={async () => {
                    setShowSuccess(false);
                    const nextLevelId = await courseService.getNextLevelId(id as string);
                    if (nextLevelId) {
                        router.replace(`/screens/exercise/ExerciseScreen?id=${nextLevelId}`);
                    } else {
                        Alert.alert('¡Felicidades!', 'Has completado todos los niveles disponibles.');
                        router.replace('/(tabs)/home');
                    }
                }}
                xp={10}
                gems={2}
            />

            <NextExerciseModal
                visible={showNextExercise}
                onNext={handleNextExercise}
            />

            <GameOverModal
                visible={showGameOver}
                onRetry={handleRetry}
                onHome={() => {
                    setShowGameOver(false);
                    router.replace('/(tabs)/home');
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    toolbar: {
        alignItems: 'flex-end',
        paddingHorizontal: 20,
        marginBottom: 5,
        marginTop: 5,
    },
});