import React from 'react';
import { TouchableOpacity, Text, LayoutAnimation, StyleSheet } from 'react-native';

interface Props {
    showCode: boolean;
    onToggle: () => void;
}

export default function ExerciseToolbar({ showCode, onToggle }: Props) {
    return (
        <TouchableOpacity
            onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                onToggle();
            }}
            style={styles.toggleBtn}
        >
            <Text style={styles.toggleText}>{showCode ? 'Ocultar Código' : '</> Ver Código'}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    toggleBtn: {
        backgroundColor: '#F0F0F0',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E0E5E0',
    },
    toggleText: {
        color: '#555',
        fontWeight: 'bold',
        fontSize: 12,
    },
});