import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BlocklyEditor from '../../components/map/BlocklyEditor';
import { exerciseService } from '../../src/services/exerciseService';

export default function ExerciseScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [exercise, setExercise] = useState<any>(null);
    const [currentCode, setCurrentCode] = useState('');

    useEffect(() => {
        loadExercise();
    }, []);

    async function loadExercise() {
        try {
            const data = await exerciseService.getExerciseByLesson(id as string);
            setExercise(data);
        } catch (e) {
            Alert.alert("Error", "No hay ejercicios para esta lección aún.");
            router.back();
        }
    }

    const checkSolution = () => {
        // Comparamos el código generado contra la solución de la base de datos
        if (currentCode.trim() === exercise.solution_js.trim()) {
            Alert.alert("¡Increíble!", "Has resuelto el reto correctamente. +10 XP", [
                { text: "CONTINUAR", onPress: () => router.back() }
            ]);
        } else {
            Alert.alert("Casi...", "Tu código no coincide con la solución esperada. Revisa los bloques.");
        }
    };

    if (!exercise) return null;

    // Dentro de ExerciseScreen.tsx
    return (
        <SafeAreaView style={styles.container}>
            {/* BARRA DE PROGRESO SUPERIOR */}
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.closeBtn}>✕</Text>
                </TouchableOpacity>
                <View style={styles.progressBg}>
                    <View style={[styles.progressFill, { width: '40%' }]} />
                </View>
                <Text style={styles.heartText}>❤️ 5</Text>
            </View>

            {/* BURBUJA DE INSTRUCCIÓN */}
            <View style={styles.instructionContainer}>
                <View style={styles.avatarMini}>
                    <Text style={{ fontSize: 30 }}>🤖</Text>
                </View>
                <View style={styles.bubble}>
                    <Text style={styles.instructionText}>{exercise.instruction}</Text>
                </View>
            </View>

            {/* EDITOR BLOCKLY (Ahora limpio) */}
            <View style={styles.editorContainer}>
                <BlocklyEditor
                    toolboxConfig={exercise.toolbox_config}
                    onCodeChange={setCurrentCode}
                />
            </View>

            {/* BOTÓN DE COMPROBAR */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.checkButton} onPress={checkSolution}>
                    <Text style={styles.checkButtonText}>COMPROBAR</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        gap: 15
    },
    closeBtn: { fontSize: 24, color: '#AFAFAF', fontWeight: 'bold' },
    progressBg: {
        flex: 1,
        height: 16,
        backgroundColor: '#E5E5E5',
        borderRadius: 10,
        overflow: 'hidden'
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#58CC02',
        borderRadius: 10
    },
    heartText: { fontWeight: 'bold', color: '#FF4B4B', fontSize: 18 },
    instructionContainer: {
        flexDirection: 'row',
        padding: 20,
        alignItems: 'center'
    },
    avatarMini: { marginRight: 15 },
    bubble: {
        flex: 1,
        borderWidth: 2,
        borderColor: '#E5E5E5',
        borderRadius: 15,
        padding: 12
    },
    instructionText: { fontSize: 16, fontWeight: 'bold', color: '#4B4B4B' },
    editorContainer: { flex: 1 },
    footer: { padding: 20, borderTopWidth: 2, borderTopColor: '#E5E5E5' },
    checkButton: {
        backgroundColor: '#58CC02',
        padding: 18,
        borderRadius: 16,
        borderBottomWidth: 5,
        borderBottomColor: '#46A302',
        alignItems: 'center'
    },
    checkButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 18, letterSpacing: 1 }
});