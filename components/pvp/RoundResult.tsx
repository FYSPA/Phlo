import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface Props {
    result: 'win' | 'lose' | 'tie' | null;
    onComplete: () => void;
}

export default function RoundResult({ result, onComplete }: Props) {
    const fadeAnim = new Animated.Value(0);
    const scaleAnim = new Animated.Value(0.5);

    useEffect(() => {
        if (result) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 5,
                    tension: 100,
                    useNativeDriver: true,
                }),
            ]).start();

            const timer = setTimeout(() => {
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }).start(() => onComplete());
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [result]);

    if (!result) return null;

    const config = {
        win: { text: '¡GANASTE!', color: '#58CC02', icon: '✓' },
        lose: { text: 'PhloBot gana', color: '#FF4B4B', icon: '✗' },
        tie: { text: 'Empate', color: '#FF9600', icon: '½' },
    };

    const { text, color, icon } = config[result];

    return (
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
            <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
                <View style={[styles.iconCircle, { backgroundColor: color }]}>
                    <Text style={styles.icon}>{icon}</Text>
                </View>
                <Text style={[styles.text, { color }]}>{text}</Text>
            </Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        minWidth: 200,
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },
    icon: {
        fontSize: 32,
        color: '#FFF',
        fontWeight: '900',
    },
    text: {
        fontSize: 24,
        fontWeight: '900',
    },
});