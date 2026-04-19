import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SuccessModal({ visible, onNext, onNextLevel, xp, gems }: any) {
    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <Text style={styles.emoji}>🥳</Text>
                    <Text style={styles.title}>¡Buen trabajo!</Text>

                    <View style={styles.statsRow}>
                        <Text style={styles.statText}>⚡ +{xp} XP</Text>
                        <Text style={styles.statText}>💎 +{gems} Gemas</Text>
                    </View>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.buttonSecondary} onPress={onNext}>
                            <Text style={styles.buttonTextSecondary}>ACEPTAR</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.buttonPrimary} onPress={onNextLevel}>
                            <Text style={styles.buttonTextPrimary}>SIGUIENTE</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    content: {
        backgroundColor: '#fff',
        padding: 30,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        alignItems: 'center'
    },
    emoji: { fontSize: 60, marginBottom: 10 },
    title: { fontSize: 26, fontWeight: 'bold', color: '#58CC02', marginBottom: 20 },
    statsRow: { flexDirection: 'row', gap: 20, marginBottom: 30 },
    statText: { fontSize: 18, fontWeight: 'bold', color: '#4B4B4B' },
    buttonRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        gap: 15
    },
    buttonSecondary: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#E5E5E5',
        borderBottomWidth: 5,
        alignItems: 'center'
    },
    buttonTextSecondary: {
        color: '#58CC02',
        fontWeight: 'bold',
        fontSize: 16
    },
    buttonPrimary: {
        flex: 1,
        backgroundColor: '#58CC02',
        padding: 16,
        borderRadius: 16,
        borderBottomWidth: 5,
        borderBottomColor: '#46A302',
        alignItems: 'center'
    },
    buttonTextPrimary: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    }
});