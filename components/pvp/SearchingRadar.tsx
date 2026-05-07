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
                    <User color="#FFF" size={40} />
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
        backgroundColor: '#00E5FF',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#1A1A2E',
        borderWidth: 3,
        borderColor: '#00E5FF',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 15,
        elevation: 10,
    },
    text: {
        marginTop: 80,
        color: '#00E5FF',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    subtext: {
        marginTop: 8,
        color: '#A0A0A0',
        fontSize: 14,
    }
});
