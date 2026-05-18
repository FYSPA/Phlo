import React, { useEffect, useRef, useCallback } from 'react';
import { Animated, Easing, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface GameOverModalProps {
    visible: boolean;
    onRetry: () => void;
    onHome: () => void;
}

export default function GameOverModal({ visible, onRetry, onHome }: GameOverModalProps) {
    const overlayOpacity = useRef(new Animated.Value(0)).current;
    const heartScale = useRef(new Animated.Value(0.3)).current;
    const heartBeat = useRef(new Animated.Value(1)).current;
    const crackProgress = useRef(new Animated.Value(0)).current;
    const leftHalfX = useRef(new Animated.Value(0)).current;
    const leftHalfRotate = useRef(new Animated.Value(0)).current;
    const leftHalfY = useRef(new Animated.Value(0)).current;
    const rightHalfX = useRef(new Animated.Value(0)).current;
    const rightHalfRotate = useRef(new Animated.Value(0)).current;
    const rightHalfY = useRef(new Animated.Value(0)).current;
    const buttonsOpacity = useRef(new Animated.Value(0)).current;
    const buttonsTranslateY = useRef(new Animated.Value(30)).current;
    const titleOpacity = useRef(new Animated.Value(0)).current;
    const titleTranslateY = useRef(new Animated.Value(-20)).current;
    const shakeAnim = useRef(new Animated.Value(0)).current;
    const heartOpacity = useRef(new Animated.Value(1)).current;
    const particles = useRef<Animated.Value[]>([]);

    useEffect(() => {
        particles.current = Array.from({ length: 12 }, () => new Animated.Value(0));
    }, []);

    const resetAnimations = useCallback(() => {
        overlayOpacity.setValue(0);
        heartScale.setValue(0.3);
        heartBeat.setValue(1);
        crackProgress.setValue(0);
        leftHalfX.setValue(0);
        leftHalfRotate.setValue(0);
        leftHalfY.setValue(0);
        rightHalfX.setValue(0);
        rightHalfRotate.setValue(0);
        rightHalfY.setValue(0);
        buttonsOpacity.setValue(0);
        buttonsTranslateY.setValue(30);
        titleOpacity.setValue(0);
        titleTranslateY.setValue(-20);
        shakeAnim.setValue(0);
        heartOpacity.setValue(1);
        particles.current.forEach(p => p.setValue(0));
    }, []);

    const runHeartbeatSequence = useCallback(() => {
        return Animated.sequence([
            Animated.timing(heartBeat, {
                toValue: 1.15,
                duration: 200,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(heartBeat, {
                toValue: 1,
                duration: 200,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(heartBeat, {
                toValue: 1.2,
                duration: 250,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(heartBeat, {
                toValue: 1,
                duration: 200,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
            }),
        ]);
    }, []);

    const runShakeSequence = useCallback(() => {
        return Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 8, duration: 40, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -8, duration: 40, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 6, duration: 40, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -6, duration: 40, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 3, duration: 40, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 40, useNativeDriver: true }),
        ]);
    }, []);

    const runSplitAnimation = useCallback(() => {
        return Animated.parallel([
            Animated.timing(leftHalfX, { toValue: -45, duration: 600, easing: Easing.in(Easing.quad), useNativeDriver: true }),
            Animated.timing(leftHalfRotate, { toValue: -12, duration: 600, easing: Easing.in(Easing.quad), useNativeDriver: true }),
            Animated.timing(leftHalfY, { toValue: 100, duration: 600, easing: Easing.in(Easing.quad), useNativeDriver: true }),
            Animated.timing(rightHalfX, { toValue: 45, duration: 600, easing: Easing.in(Easing.quad), useNativeDriver: true }),
            Animated.timing(rightHalfRotate, { toValue: 12, duration: 600, easing: Easing.in(Easing.quad), useNativeDriver: true }),
            Animated.timing(rightHalfY, { toValue: 100, duration: 600, easing: Easing.in(Easing.quad), useNativeDriver: true }),
        ]);
    }, []);

    const runParticles = useCallback(() => {
        const particleAnimations = particles.current.map((_, i) => {
            const angle = (i / particles.current.length) * 2 * Math.PI;
            const distance = 60 + Math.random() * 40;
            const translateX = Math.cos(angle) * distance;
            const translateY = Math.sin(angle) * distance - 30;
            
            return Animated.parallel([
                Animated.timing(particles.current[i], {
                    toValue: 1,
                    duration: 500,
                    easing: Easing.out(Easing.quad),
                    useNativeDriver: true,
                }),
                Animated.timing(particles.current[i], {
                    toValue: 0,
                    duration: 500,
                    delay: 100,
                    easing: Easing.in(Easing.quad),
                    useNativeDriver: true,
                }),
            ]);
        });
        
        return Animated.stagger(20, particleAnimations);
    }, []);

    useEffect(() => {
        if (visible) {
            resetAnimations();

            Animated.sequence([
                Animated.timing(overlayOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
                
                Animated.spring(heartScale, { toValue: 1, friction: 4, tension: 50, useNativeDriver: true }),
                
                runHeartbeatSequence(),
                
                Animated.delay(200),
                
                Animated.timing(crackProgress, { toValue: 1, duration: 600, easing: Easing.in(Easing.ease), useNativeDriver: true }),
                
                runShakeSequence(),
                
                Animated.parallel([
                    runSplitAnimation(),
                    runParticles(),
                ]),
                
                Animated.timing(heartOpacity, { toValue: 0, duration: 300, delay: 100, useNativeDriver: true }),
                
                Animated.delay(150),
                
                Animated.parallel([
                    Animated.timing(titleOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
                    Animated.spring(titleTranslateY, { toValue: 0, friction: 8, useNativeDriver: true }),
                    Animated.timing(buttonsOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
                    Animated.spring(buttonsTranslateY, { toValue: 0, friction: 8, useNativeDriver: true }),
                ]),
            ]).start();
        }
    }, [visible, resetAnimations, runHeartbeatSequence, runShakeSequence, runSplitAnimation, runParticles]);

    const leftRotateInterp = leftHalfRotate.interpolate({
        inputRange: [-15, 0],
        outputRange: ['-12deg', '0deg'],
    });

    const rightRotateInterp = rightHalfRotate.interpolate({
        inputRange: [0, 15],
        outputRange: ['0deg', '12deg'],
    });

    const crackOpacity = crackProgress.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0.8, 1],
    });

    const renderParticles = () => {
        return particles.current.map((animValue, i) => {
            const angle = (i / particles.current.length) * 2 * Math.PI;
            const distance = 60 + (i % 3) * 20;
            const translateX = Math.cos(angle) * distance;
            const translateY = Math.sin(angle) * distance - 30;
            
            const opacity = animValue.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 1, 0],
            });
            
            const scale = animValue.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.3, 1, 0.3],
            });

            return (
                <Animated.View
                    key={i}
                    style={[
                        styles.particle,
                        {
                            opacity,
                            transform: [
                                { translateX },
                                { translateY },
                                { scale },
                            ],
                        },
                    ]}
                />
            );
        });
    };

    const heartScaleCombined = Animated.multiply(heartScale, heartBeat);
    const heartTransform = [
        { scale: heartScaleCombined },
        { translateX: shakeAnim },
    ];

    return (
        <Modal visible={visible} transparent animationType="none">
            <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>

                <Animated.View style={[styles.heartContainer, { transform: heartTransform }]}>
                    <Animated.View style={[styles.heartHalfWrapper, {
                        transform: [
                            { translateX: leftHalfX },
                            { translateY: leftHalfY },
                            { rotate: leftRotateInterp },
                        ],
                        opacity: heartOpacity,
                    }]}>
                        <View style={styles.heartLeftHalf}>
                            <View style={styles.heartLobeLeft} />
                            <View style={styles.heartTriangleLeft} />
                        </View>
                    </Animated.View>

                    <Animated.View style={[styles.heartHalfWrapper, {
                        transform: [
                            { translateX: rightHalfX },
                            { translateY: rightHalfY },
                            { rotate: rightRotateInterp },
                        ],
                        opacity: heartOpacity,
                    }]}>
                        <View style={styles.heartRightHalf}>
                            <View style={styles.heartLobeRight} />
                            <View style={styles.heartTriangleRight} />
                        </View>
                    </Animated.View>

                    <Animated.View style={[styles.crackContainer, { opacity: crackOpacity }]}>
                        <View style={styles.crackLine1} />
                        <View style={styles.crackLine2} />
                        <View style={styles.crackLine3} />
                        <View style={styles.crackLine4} />
                        <View style={styles.crackLine5} />
                    </Animated.View>

                    <View style={styles.particlesContainer}>
                        {renderParticles()}
                    </View>
                </Animated.View>

                <Animated.View style={[styles.textContainer, {
                    opacity: titleOpacity,
                    transform: [{ translateY: titleTranslateY }],
                }]}>
                    <Text style={styles.title}>Game Over</Text>
                    <Text style={styles.subtitle}>Te quedaste sin vidas</Text>
                </Animated.View>

                <Animated.View style={[styles.buttonsContainer, {
                    opacity: buttonsOpacity,
                    transform: [{ translateY: buttonsTranslateY }],
                }]}>
                    <TouchableOpacity style={styles.retryButton} onPress={onRetry} activeOpacity={0.8}>
                        <Text style={styles.retryButtonText}>REINTENTAR</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.homeButton} onPress={onHome} activeOpacity={0.6}>
                        <Text style={styles.homeButtonText}>VOLVER AL INICIO</Text>
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
}

const HEART_SIZE = 120;
const LOBE_SIZE = HEART_SIZE / 2;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 5, 10, 0.95)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heartContainer: {
        width: HEART_SIZE,
        height: HEART_SIZE,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heartHalfWrapper: {
        position: 'absolute',
        width: HEART_SIZE / 2 + 2,
        height: HEART_SIZE,
        top: 0,
        overflow: 'hidden',
    },
    heartLeftHalf: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: HEART_SIZE,
        height: HEART_SIZE,
    },
    heartRightHalf: {
        position: 'absolute',
        right: 0,
        top: 0,
        width: HEART_SIZE,
        height: HEART_SIZE,
    },
    heartLobeLeft: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: LOBE_SIZE,
        height: LOBE_SIZE,
        borderRadius: LOBE_SIZE / 2,
        backgroundColor: '#FF4B4B',
    },
    heartLobeRight: {
        position: 'absolute',
        right: 0,
        top: 0,
        width: LOBE_SIZE,
        height: LOBE_SIZE,
        borderRadius: LOBE_SIZE / 2,
        backgroundColor: '#FF4B4B',
    },
    heartTriangleLeft: {
        position: 'absolute',
        left: 0,
        top: LOBE_SIZE / 2,
        width: 0,
        height: 0,
        borderLeftWidth: LOBE_SIZE,
        borderRightWidth: 0,
        borderTopWidth: LOBE_SIZE / 2 + 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#FF4B4B',
    },
    heartTriangleRight: {
        position: 'absolute',
        right: 0,
        top: LOBE_SIZE / 2,
        width: 0,
        height: 0,
        borderLeftWidth: 0,
        borderRightWidth: LOBE_SIZE,
        borderTopWidth: LOBE_SIZE / 2 + 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#FF4B4B',
    },
    crackContainer: {
        position: 'absolute',
        left: HEART_SIZE / 2 - 3,
        top: 8,
        width: 6,
        height: HEART_SIZE - 16,
        zIndex: 10,
    },
    crackLine1: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 3,
        height: 20,
        backgroundColor: '#0d0508',
        transform: [{ rotate: '8deg' }],
    },
    crackLine2: {
        position: 'absolute',
        top: 16,
        left: 1,
        width: 3,
        height: 18,
        backgroundColor: '#0d0508',
        transform: [{ rotate: '-12deg' }],
    },
    crackLine3: {
        position: 'absolute',
        top: 32,
        left: 0,
        width: 3,
        height: 20,
        backgroundColor: '#0d0508',
        transform: [{ rotate: '10deg' }],
    },
    crackLine4: {
        position: 'absolute',
        top: 48,
        left: 1,
        width: 3,
        height: 18,
        backgroundColor: '#0d0508',
        transform: [{ rotate: '-8deg' }],
    },
    crackLine5: {
        position: 'absolute',
        top: 64,
        left: 0,
        width: 3,
        height: 20,
        backgroundColor: '#0d0508',
        transform: [{ rotate: '5deg' }],
    },
    particlesContainer: {
        position: 'absolute',
        width: HEART_SIZE,
        height: HEART_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    particle: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF6B6B',
    },
    textContainer: {
        marginTop: 50,
        alignItems: 'center',
    },
    title: {
        fontSize: 42,
        fontWeight: '900',
        color: '#FF4B4B',
        textAlign: 'center',
        letterSpacing: 2,
        textShadowColor: 'rgba(255, 75, 75, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 10,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '500',
        color: '#8A8A8A',
        textAlign: 'center',
        marginTop: 10,
    },
    buttonsContainer: {
        width: '80%',
        marginTop: 60,
        gap: 16,
    },
    retryButton: {
        backgroundColor: '#FF4B4B',
        paddingVertical: 18,
        paddingHorizontal: 32,
        borderRadius: 14,
        alignItems: 'center',
        shadowColor: '#FF4B4B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontWeight: '800',
        fontSize: 17,
        letterSpacing: 1.5,
    },
    homeButton: {
        backgroundColor: 'transparent',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        alignItems: 'center',
    },
    homeButtonText: {
        color: '#888888',
        fontWeight: '600',
        fontSize: 15,
        letterSpacing: 1,
    },
});
