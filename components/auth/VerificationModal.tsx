import LottieView from 'lottie-react-native';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ErrorAuthModalProps {
    visible: boolean;
    onClose: () => void;
}


export default function ErrorAuthModal({ visible, onClose }: ErrorAuthModalProps) {

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <LottieView
                        source={require('../../assets/lottie/authAnimations/verify_email_animation.json')}
                        autoPlay
                        loop
                        style={{ width: 200, height: 200 }}
                    />
                    <Text style={styles.title}>¡Cuenta verificada correctamente!</Text>

                    <TouchableOpacity
                        style={styles.buttonPrimary}
                        onPress={onClose}
                    >
                        <Text style={styles.buttonTextPrimary}>CONTINUAR</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center' },
    content: {
        backgroundColor: '#fff',
        padding: 50,
        borderRadius: 50,
        alignItems: 'center',
        margin: 20
    },
    emoji: { fontSize: 60, marginBottom: 10 },
    title: { fontSize: 26, fontWeight: 'bold', color: '#58CC02', marginBottom: 20, textAlign: 'center' },
    subtitle: { fontSize: 16, color: '#777', textAlign: 'center', marginBottom: 30, paddingHorizontal: 20, fontWeight: '600' },
    buttonRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        gap: 15
    },
    buttonSecondary: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#E5E5E5',
        borderBottomWidth: 5,
        alignItems: 'center'
    },
    buttonTextSecondary: {
        color: '#58CC02',
        fontWeight: 'bold',
        fontSize: 16
    },
    buttonPrimary: {
        width: '100%',
        backgroundColor: '#58CC02',
        padding: 16,
        borderRadius: 16,
        borderBottomWidth: 5,
        borderBottomColor: '#46A302',
        alignItems: 'center'
    },
    buttonTextPrimary: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    },
    resendButton: {
        marginTop: 16,
        paddingVertical: 8,
    },
    resendText: {
        color: '#1CB0F6',
        fontWeight: '600',
        fontSize: 14,
    },
});
