import React, { useEffect, useRef } from 'react';
import { Animated, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface NextExerciseModalProps {
    visible: boolean;
    onNext: () => void;
}

export default function NextExerciseModal({ visible, onNext }: NextExerciseModalProps) {
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        if (visible) {
            scaleAnim.setValue(0.8);
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 6,
                tension: 40,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <Animated.View style={[styles.content, { transform: [{ scale: scaleAnim }] }]}>
                    <View style={styles.headerRow}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.icon}>✅</Text>
                        </View>
                        <Text style={styles.title}>¡Excelente!</Text>
                    </View>
                    <Text style={styles.subtitle}>Has completado el ejercicio correctamente.</Text>

                    <TouchableOpacity style={styles.button} onPress={onNext}>
                        <Text style={styles.buttonText}>CONTINUAR</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'flex-end' },
    content: {
        backgroundColor: '#d7ffb8',
        padding: 25,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        borderTopWidth: 2,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderColor: '#58CC02',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    iconContainer: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 5,
        marginRight: 10,
    },
    icon: { fontSize: 24 },
    title: { fontSize: 26, fontWeight: 'bold', color: '#58CC02' },
    subtitle: { fontSize: 16, color: '#4B4B4B', marginBottom: 25, fontWeight: '600' },
    button: {
        backgroundColor: '#58CC02',
        width: '100%',
        padding: 18,
        borderRadius: 16,
        borderBottomWidth: 5,
        borderBottomColor: '#46A302',
        alignItems: 'center'
    },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18, letterSpacing: 1.2 }
});
