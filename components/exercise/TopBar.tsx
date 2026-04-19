import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TopBarProps {
    lives: number;
    progress?: number;
    onClose: () => void;
}

export default function TopBar({ lives, progress = 0, onClose }: TopBarProps) {
    const progressAnim = useRef(new Animated.Value(progress)).current;

    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: progress,
            duration: 400,
            useNativeDriver: false, // width cannot use native driver
        }).start();
    }, [progress]);

    const widthInterpolated = progressAnim.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%']
    });

    return (
        <View style={styles.topBar}>
            <TouchableOpacity onPress={onClose}>
                <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
            <View style={styles.progressBg}>
                <Animated.View style={[styles.progressFill, { width: widthInterpolated }]} />
            </View>
            <View style={styles.stats}>
                <Text style={styles.heartText}>❤️ {lives}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        justifyContent: 'space-between'
    },
    closeBtn: { fontSize: 24, color: '#AFAFAF', fontWeight: 'bold' },
    progressBg: {
        flex: 1,
        height: 14,
        backgroundColor: '#E5E5E5',
        borderRadius: 10,
        marginHorizontal: 15,
        overflow: 'hidden'
    },
    progressFill: { height: '100%', backgroundColor: '#58CC02', borderRadius: 10 },
    stats: { flexDirection: 'row', alignItems: 'center' },
    heartText: { color: '#FF4B4B', fontWeight: 'bold', fontSize: 18 },
});
