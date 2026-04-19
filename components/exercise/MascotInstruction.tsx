import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface MascotInstructionProps {
    instruction: string;
}

export default function MascotInstruction({ instruction }: MascotInstructionProps) {
    return (
        <View style={styles.mascotContainer}>
            <Text style={styles.mascotEmoji}>🤖</Text>
            <View style={styles.speechBubble}>
                <Text style={styles.instructionText}>{instruction}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mascotContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingBottom: 15,
        alignItems: 'center'
    },
    mascotEmoji: { fontSize: 50, marginRight: 10 },
    speechBubble: {
        flex: 1,
        borderWidth: 2,
        borderColor: '#E5E5E5',
        borderRadius: 20,
        padding: 15,
        backgroundColor: '#fff'
    },
    instructionText: { fontSize: 16, fontWeight: 'bold', color: '#4B4B4B' },
});
