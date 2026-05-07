import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withDelay, withSequence, withTiming, Easing } from 'react-native-reanimated';
import { User } from 'lucide-react-native';

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
        
        // El VS aparece después con un impacto
        vsScale.value = withDelay(400, 
            withSequence(
                withSpring(1.5, { damping: 10, stiffness: 100 }),
                withSpring(1, { damping: 8, stiffness: 100 })
            )
        );
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
            <Text style={styles.title}>¡Oponente Encontrado!</Text>
            
            <View style={styles.matchup}>
                <Animated.View style={[styles.playerCard, leftStyle]}>
                    <View style={[styles.avatar, { borderColor: '#00E5FF' }]}>
                        <User color="#FFF" size={50} />
                    </View>
                    <Text style={styles.playerName}>Tú</Text>
                    <Text style={styles.playerRank}>1240 🏆</Text>
                </Animated.View>

                <Animated.View style={[styles.vsContainer, vsStyle]}>
                    <Text style={styles.vsText}>VS</Text>
                </Animated.View>

                <Animated.View style={[styles.playerCard, rightStyle]}>
                    <View style={[styles.avatar, { borderColor: '#FF0055' }]}>
                        <User color="#FFF" size={50} />
                    </View>
                    <Text style={[styles.playerName, { color: '#FF0055' }]}>Rival_404</Text>
                    <Text style={styles.playerRank}>1255 🏆</Text>
                </Animated.View>
            </View>
            
            <Animated.Text style={[styles.subtitle, vsStyle]}>
                PREPÁRATE...
            </Animated.Text>
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
        backgroundColor: '#1A1A2E',
        borderWidth: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
    },
    playerName: {
        color: '#00E5FF',
        fontSize: 20,
        fontWeight: '900',
        marginBottom: 4,
    },
    playerRank: {
        color: '#A0A0A0',
        fontSize: 14,
        fontWeight: 'bold',
    },
    vsContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FFD700',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 15,
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
        elevation: 15,
        zIndex: 10,
    },
    vsText: {
        color: '#121223',
        fontSize: 22,
        fontWeight: '900',
        fontStyle: 'italic',
    }
});
