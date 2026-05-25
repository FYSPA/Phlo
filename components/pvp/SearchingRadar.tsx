import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, interpolate } from 'react-native-reanimated';
import { User } from 'lucide-react-native';

export default function SearchingRadar() {
    const pulse = useSharedValue(0);

    useEffect(() => {
        pulse.value = withRepeat(
            withTiming(1, { duration: 2000, easing: Easing.out(Easing.ease) }),
            -1, // infinito
            false
        );
    }, []);

    const ring1Style = useAnimatedStyle(() => {
        return {
            transform: [{ scale: interpolate(pulse.value, [0, 1], [1, 4]) }],
            opacity: interpolate(pulse.value, [0, 0.8, 1], [0.6, 0, 0]),
        };
    });

    const ring2Style = useAnimatedStyle(() => {
        // Un anillo desfasado
        const offsetPulse = (pulse.value + 0.5) % 1;
        return {
            transform: [{ scale: interpolate(offsetPulse, [0, 1], [1, 4]) }],
            opacity: interpolate(offsetPulse, [0, 0.8, 1], [0.4, 0, 0]),
        };
    });

    return (
        <View style={styles.container}>
            <View style={styles.radarCenter}>
                <Animated.View style={[styles.ring, ring1Style]} />
                <Animated.View style={[styles.ring, ring2Style]} />
                
                <View style={styles.avatar}>
                    <User color="#4F46E5" size={40} />
                </View>
            </View>
            
            <Text style={styles.text}>Buscando oponente...</Text>
            <Text style={styles.subtext}>Expandiendo el rango de búsqueda</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radarCenter: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ring: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#EEF2F6',
        borderWidth: 2,
        borderColor: '#6366F1',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    text: {
        marginTop: 80,
        color: '#1F2937',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1.5,
    },
    subtext: {
        marginTop: 8,
        color: '#6B7280',
        fontSize: 14,
    }
});
