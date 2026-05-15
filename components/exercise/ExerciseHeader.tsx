import React from 'react';
import { View, StyleSheet } from 'react-native';
import TopBar from './TopBar';
import MascotInstruction from './MascotInstruction';

interface Props {
    lives: number;
    progress: number;
    instruction: string;
    onClose: () => void;
}

export default function ExerciseHeader({ lives, progress, instruction, onClose }: Props) {
    return (
        <View>
            <TopBar lives={lives} progress={progress} onClose={onClose} />
            <MascotInstruction instruction={instruction} />
        </View>
    );
}