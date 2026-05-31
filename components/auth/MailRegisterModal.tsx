import LottieView from 'lottie-react-native';
import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MailRegisterModalProps {
    visible: boolean;
    onClose: () => void;
    email: string;
    onResend: (email: string) => Promise<void>;
}

export default function MailRegisterModal({ visible, onClose, email, onResend }: MailRegisterModalProps) {
    const [resending, setResending] = useState(false);

    const handleResend = async () => {
        setResending(true);
        try {
            await onResend(email);
            Alert.alert('Correo reenviado', 'Revisa tu bandeja de entrada.');
        } catch (e: any) {
            Alert.alert('Error', e?.message || 'No se pudo reenviar el correo.');
        }
        setResending(false);
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <LottieView
                        source={require('../../assets/lottie/authAnimations/mail_animation.json')}
                        autoPlay
                        loop
                        style={{ width: 300, height: 300 }}
                    />
                    <Text style={styles.title}>Correo Enviado</Text>
                    <Text style={styles.subtitle}>Abre tu correo electrónico y confirma tu cuenta.</Text>

                    <TouchableOpacity
                        style={styles.buttonPrimary}
                        onPress={onClose}
                    >
                        <Text style={styles.buttonTextPrimary}>CONTINUAR</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.resendButton}
                        onPress={handleResend}
                        disabled={resending}
                    >
                        <Text style={styles.resendText}>
                            {resending ? 'REENVIANDO...' : '¿No te llegó? Reenviar correo'}
                        </Text>
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
    title: { fontSize: 26, fontWeight: 'bold', color: '#58CC02', marginBottom: 20 },
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
