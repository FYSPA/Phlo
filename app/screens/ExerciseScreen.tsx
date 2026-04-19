import SuccessModal from '@/components/exercise/SuccessModal';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, LayoutAnimation, StyleSheet, Vibration, View } from 'react-native';
import { useSharedValue, withSpring } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import CheckFooter from '../../components/exercise/CheckFooter';
import MascotInstruction from '../../components/exercise/MascotInstruction';
import NextExerciseModal from '../../components/exercise/NextExerciseModal';
import TopBar from '../../components/exercise/TopBar';
import BlocklyEditor from '../../components/map/BlocklyEditor';
import { courseService } from '../../src/services/courseService';
import { exerciseService } from '../../src/services/exerciseService';
import { supabase } from '../../src/services/supabase';
import { validateSolution } from '../../src/utils/codeUtils';


export default function ExerciseScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [exercises, setExercises] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentCode, setCurrentCode] = useState('');
    const [lives, setLives] = useState(5);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showNextExercise, setShowNextExercise] = useState(false);
    const progressWidth = useSharedValue(0);


    useEffect(() => {
        if (exercises.length > 0) {
            const newProgress = ((currentIndex + 1) / exercises.length) * 100;
            // withSpring hace que rebote un poquito como Duolingo
            progressWidth.value = withSpring(newProgress, { damping: 15 });
        }
    }, []);

    useEffect(() => {
        loadExercises();
    }, [id]);


    async function loadExercises() {
        setExercises([]);
        setCurrentIndex(0);
        setCurrentCode('');

        // 1. Traer TODOS los ejercicios de esta lección
        const { data } = await supabase
            .from('exercises')
            .select('*')
            .eq('lesson_id', id)
            .order('order_index', { ascending: true });

        if (data && data.length > 0) {
            setExercises(data);
        }
    }

    const exercise = exercises[currentIndex];
    if (!exercise) return <ActivityIndicator />;



    const checkSolution = async () => {
        const currentExercise = exercises[currentIndex];
        const isCorrect = validateSolution(currentCode, currentExercise.solution_js);

        if (isCorrect) {
            if (currentIndex < exercises.length - 1) {
                setShowNextExercise(true);
            } else {
                await exerciseService.completeLevel(id as string, 10, 2);
                setShowSuccess(true);
            }
        } else {
            Vibration.vibrate(500);
            setLives(prev => prev - 1);
            Alert.alert("INTENTA DE NUEVO", "Los bloques no están en el orden correcto.");
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <TopBar lives={lives} progress={exercises.length > 0 ? (currentIndex / exercises.length) * 100 : 0} onClose={() => router.back()} />

            <MascotInstruction instruction={exercise.instruction} />

            <View style={styles.editorContainer}>
                <BlocklyEditor
                    toolboxConfig={exercise.toolbox_config}
                    onCodeChange={setCurrentCode}
                />
            </View>

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
                        router.replace(`/screens/ExerciseScreen?id=${nextLevelId}`);
                    } else {
                        Alert.alert("¡Felicidades!", "Has completado todos los niveles disponibles.");
                        router.replace('/(tabs)/home');
                    }
                }}
                xp={10}
                gems={2}
            />

            <NextExerciseModal
                visible={showNextExercise}
                onNext={() => {
                    setShowNextExercise(false);
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
                    setCurrentIndex(prev => prev + 1);
                    setCurrentCode('');
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    editorContainer: { flex: 1 }
});