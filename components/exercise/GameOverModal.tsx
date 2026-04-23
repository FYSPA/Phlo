import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface GameOverModalProps {
    visible: boolean;
    onRetry: () => void;
    onHome: () => void;
}

export default function GameOverModal({ visible, onRetry, onHome }: GameOverModalProps) {
    // Animaciones
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

    useEffect(() => {
        if (visible) {
            // Reset todos los valores
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

            // Secuencia de animación cinematográfica
            Animated.sequence([
                // 1. Fondo oscuro aparece
                Animated.timing(overlayOpacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),

                // 2. El corazón aparece con un bounce
                Animated.spring(heartScale, {
                    toValue: 1,
                    friction: 4,
                    tension: 50,
                    useNativeDriver: true,
                }),

                // 3. El corazón late 2 veces (como un último latido)
                Animated.sequence([
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
                ]),

                // 4. Pausa dramática
                Animated.delay(300),

                // 5. La grieta se dibuja
                Animated.timing(crackProgress, {
                    toValue: 1,
                    duration: 800,
                    easing: Easing.in(Easing.ease),
                    useNativeDriver: true,
                }),

                // 6. Shake del corazón al quebrarse
                Animated.sequence([
                    Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
                    Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
                    Animated.timing(shakeAnim, { toValue: 5, duration: 50, useNativeDriver: true }),
                    Animated.timing(shakeAnim, { toValue: -5, duration: 50, useNativeDriver: true }),
                    Animated.timing(shakeAnim, { toValue: 3, duration: 50, useNativeDriver: true }),
                    Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
                ]),

                // 7. Las mitades se separan y caen
                Animated.parallel([
                    Animated.timing(leftHalfX, {
                        toValue: -40,
                        duration: 700,
                        easing: Easing.in(Easing.quad),
                        useNativeDriver: true,
                    }),
                    Animated.timing(leftHalfRotate, {
                        toValue: -15,
                        duration: 700,
                        easing: Easing.in(Easing.quad),
                        useNativeDriver: true,
                    }),
                    Animated.timing(leftHalfY, {
                        toValue: 80,
                        duration: 700,
                        easing: Easing.in(Easing.quad),
                        useNativeDriver: true,
                    }),
                    Animated.timing(rightHalfX, {
                        toValue: 40,
                        duration: 700,
                        easing: Easing.in(Easing.quad),
                        useNativeDriver: true,
                    }),
                    Animated.timing(rightHalfRotate, {
                        toValue: 15,
                        duration: 700,
                        easing: Easing.in(Easing.quad),
                        useNativeDriver: true,
                    }),
                    Animated.timing(rightHalfY, {
                        toValue: 80,
                        duration: 700,
                        easing: Easing.in(Easing.quad),
                        useNativeDriver: true,
                    }),
                ]),

                // 8. Pausa antes de los botones
                Animated.delay(200),

                // 9. Título y botones aparecen suavemente
                Animated.parallel([
                    Animated.timing(titleOpacity, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.spring(titleTranslateY, {
                        toValue: 0,
                        friction: 8,
                        useNativeDriver: true,
                    }),
                    Animated.timing(buttonsOpacity, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.spring(buttonsTranslateY, {
                        toValue: 0,
                        friction: 8,
                        useNativeDriver: true,
                    }),
                ]),
            ]).start();
        }
    }, [visible]);

    const leftRotateInterp = leftHalfRotate.interpolate({
        inputRange: [-15, 0],
        outputRange: ['-15deg', '0deg'],
    });

    const rightRotateInterp = rightHalfRotate.interpolate({
        inputRange: [0, 15],
        outputRange: ['0deg', '15deg'],
    });

    return (
        <Modal visible={visible} transparent animationType="none">
            <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>

                {/* Corazón animado */}
                <Animated.View style={[styles.heartContainer, {
                    transform: [
                        { scale: Animated.multiply(heartScale, heartBeat) },
                        { translateX: shakeAnim },
                    ]
                }]}>

                    {/* Mitad izquierda del corazón */}
                    <Animated.View style={[styles.heartHalfContainer, {
                        transform: [
                            { translateX: leftHalfX },
                            { translateY: leftHalfY },
                            { rotate: leftRotateInterp },
                        ]
                    }]}>
                        <View style={styles.heartHalfWrapper}>
                            {/* Lóbulo izquierdo */}
                            <View style={[styles.heartLobe, styles.heartLobeLeft]} />
                            {/* Triángulo izquierdo (parte inferior) */}
                            <View style={styles.heartTriangleLeft} />
                        </View>
                    </Animated.View>

                    {/* Mitad derecha del corazón */}
                    <Animated.View style={[styles.heartHalfContainer, {
                        transform: [
                            { translateX: rightHalfX },
                            { translateY: rightHalfY },
                            { rotate: rightRotateInterp },
                        ]
                    }]}>
                        <View style={styles.heartHalfWrapper}>
                            {/* Lóbulo derecho */}
                            <View style={[styles.heartLobe, styles.heartLobeRight]} />
                            {/* Triángulo derecho (parte inferior) */}
                            <View style={styles.heartTriangleRight} />
                        </View>
                    </Animated.View>

                    {/* Línea de grieta (zigzag) que aparece progresivamente */}
                    <Animated.View style={[styles.crackContainer, {
                        opacity: crackProgress,
                    }]}>
                        <View style={styles.crackLine1} />
                        <View style={styles.crackLine2} />
                        <View style={styles.crackLine3} />
                        <View style={styles.crackLine4} />
                        <View style={styles.crackLine5} />
                    </Animated.View>
                </Animated.View>

                {/* Título */}
                <Animated.View style={{
                    opacity: titleOpacity,
                    transform: [{ translateY: titleTranslateY }],
                    marginTop: 40,
                }}>
                    <Text style={styles.title}>¡Oh no!</Text>
                    <Text style={styles.subtitle}>Te quedaste sin vidas</Text>
                </Animated.View>

                {/* Botones */}
                <Animated.View style={[styles.buttonsContainer, {
                    opacity: buttonsOpacity,
                    transform: [{ translateY: buttonsTranslateY }],
                }]}>
                    <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
                        <Text style={styles.retryButtonText}>REINTENTAR</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.homeButton} onPress={onHome}>
                        <Text style={styles.homeButtonText}>VOLVER AL INICIO</Text>
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
}

const HEART_SIZE = 130;
const LOBE_SIZE = HEART_SIZE / 2;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(20, 10, 15, 0.92)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heartContainer: {
        width: HEART_SIZE,
        height: HEART_SIZE,
        position: 'relative',
    },
    heartHalfContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: HEART_SIZE,
        height: HEART_SIZE,
    },
    heartHalfWrapper: {
        width: HEART_SIZE,
        height: HEART_SIZE,
        position: 'relative',
    },
    // ─── Corazón construido con CSS ────────────────────
    heartLobe: {
        position: 'absolute',
        width: LOBE_SIZE,
        height: LOBE_SIZE,
        borderRadius: LOBE_SIZE / 2,
        backgroundColor: '#FF4B4B',
        top: 0,
    },
    heartLobeLeft: {
        left: 1,
    },
    heartLobeRight: {
        right: 1,
    },
    heartTriangleLeft: {
        position: 'absolute',
        top: LOBE_SIZE / 2,
        left: 0,
        width: 0,
        height: 0,
        borderLeftWidth: HEART_SIZE / 2,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderTopWidth: HEART_SIZE / 2 + 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#FF4B4B',
        borderBottomColor: 'transparent',
    },
    heartTriangleRight: {
        position: 'absolute',
        top: LOBE_SIZE / 2,
        right: 0,
        width: 0,
        height: 0,
        borderLeftWidth: 0,
        borderRightWidth: HEART_SIZE / 2,
        borderBottomWidth: 0,
        borderTopWidth: HEART_SIZE / 2 + 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#FF4B4B',
        borderBottomColor: 'transparent',
    },
    // ─── Línea de grieta (zigzag) ──────────────────────
    crackContainer: {
        position: 'absolute',
        top: 5,
        left: HEART_SIZE / 2 - 5,
        width: 10,
        height: HEART_SIZE - 10,
        zIndex: 10,
    },
    crackLine1: {
        width: 3,
        height: 22,
        backgroundColor: '#1a0a0f',
        transform: [{ rotate: '8deg' }, { translateX: 2 }],
    },
    crackLine2: {
        width: 3,
        height: 20,
        backgroundColor: '#1a0a0f',
        transform: [{ rotate: '-15deg' }, { translateX: -3 }],
    },
    crackLine3: {
        width: 3,
        height: 22,
        backgroundColor: '#1a0a0f',
        transform: [{ rotate: '12deg' }, { translateX: 3 }],
    },
    crackLine4: {
        width: 3,
        height: 20,
        backgroundColor: '#1a0a0f',
        transform: [{ rotate: '-10deg' }, { translateX: -2 }],
    },
    crackLine5: {
        width: 3,
        height: 22,
        backgroundColor: '#1a0a0f',
        transform: [{ rotate: '6deg' }, { translateX: 1 }],
    },
    // ─── Texto ─────────────────────────────────────────
    title: {
        fontSize: 34,
        fontWeight: '900',
        color: '#FF4B4B',
        textAlign: 'center',
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#AFAFAF',
        textAlign: 'center',
        marginTop: 8,
    },
    // ─── Botones ───────────────────────────────────────
    buttonsContainer: {
        width: '85%',
        marginTop: 50,
        gap: 14,
    },
    retryButton: {
        backgroundColor: '#FF4B4B',
        padding: 18,
        borderRadius: 16,
        borderBottomWidth: 5,
        borderBottomColor: '#CC3C3C',
        alignItems: 'center',
    },
    retryButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
        letterSpacing: 1.2,
    },
    homeButton: {
        backgroundColor: 'transparent',
        padding: 16,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
    },
    homeButtonText: {
        color: '#AFAFAF',
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 1,
    },
});
