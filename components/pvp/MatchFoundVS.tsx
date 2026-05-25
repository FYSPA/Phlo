import { User } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

export default function MatchFoundVS() {
    const slideLeft = useSharedValue(-400);
    const slideRight = useSharedValue(400);
    const vsScale = useSharedValue(0);
    const bgOpacity = useSharedValue(0);

    useEffect(() => {
        bgOpacity.value = withTiming(1, { duration: 500, easing: Easing.inOut(Easing.ease) });

        // Efecto de choque: entran rápido y rebotan
        slideLeft.value = withSpring(0, { damping: 10, stiffness: 80, mass: 0.5 });
        slideRight.value = withSpring(0, { damping: 10, stiffness: 80, mass: 0.5 });

    }, []);

    const leftStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: slideLeft.value }],
    }));

    const rightStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: slideRight.value }],
    }));

    const vsStyle = useAnimatedStyle(() => ({
        transform: [{ scale: vsScale.value }],
    }));

    const bgStyle = useAnimatedStyle(() => ({
        opacity: bgOpacity.value,
    }));

    return (
        <Animated.View style={[styles.container, bgStyle]}>

            <View style={styles.matchup}>
                <Animated.View style={[styles.playerCard, leftStyle]}>
                    <View style={[styles.avatar, { borderColor: '#6366F1' }]}>
                        <User color="#4F46E5" size={50} />
                    </View>
                    <Text style={styles.playerName}>Tú</Text>
                    <Text style={styles.playerRank}>1240 🏆</Text>
                </Animated.View>

                <Animated.View style={[styles.vsContainer, vsStyle]}>
                    <Text style={styles.vsText}>VS</Text>
                </Animated.View>

                <Animated.View style={[styles.playerCard, rightStyle]}>
                    <View style={[styles.avatar, { borderColor: '#F43F5E' }]}>
                        <User color="#E11D48" size={50} />
                    </View>
                    <Text style={[styles.playerName, { color: '#E11D48' }]}>Rival_404</Text>
                    <Text style={styles.playerRank}>1255 🏆</Text>
                </Animated.View>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        color: '#FFF',
        fontSize: 26,
        fontWeight: '900',
        marginBottom: 50,
        textShadowColor: 'rgba(255, 0, 85, 0.8)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 15,
        letterSpacing: 2,
    },
    subtitle: {
        marginTop: 60,
        color: '#FFD700',
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 4,
    },
    matchup: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    playerCard: {
        alignItems: 'center',
        marginHorizontal: 5,
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 24,
        backgroundColor: '#EEF2F6',
        borderWidth: 3,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    playerName: {
        color: '#4F46E5',
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 4,
    },
    playerRank: {
        color: '#4B5563',
        fontSize: 14,
        fontWeight: 'bold',
    },
    vsContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        zIndex: 10,
    },
    vsText: {
        color: '#374151',
        fontSize: 20,
        fontWeight: '800',
        fontStyle: 'italic',
    }
});
