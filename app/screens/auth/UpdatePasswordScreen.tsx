import ErrorAuthModal from '@/components/auth/ErrorAuthModal';
import VerificationModal from '@/components/auth/VerificationModal';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../../src/services/supabase';


export default function UpdatePassword() {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [verificationVisible, setVerificationVisible] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleUpdate = async () => {
        setLoading(true);
        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            setShowErrorModal(true);
            setErrorMessage(error?.message || 'Error al actualizar la contraseña');
        } else {
            setVerificationVisible(true);
            router.replace('/screens/auth/LoginScreen');
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Nueva contraseña</Text>
            <TextInput
                style={styles.input}
                placeholder="Escribe tu nueva contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleUpdate} disabled={loading}>
                <Text style={styles.buttonText}>ACTUALIZAR CONTRASEÑA</Text>
            </TouchableOpacity>
            <VerificationModal
                visible={verificationVisible}
                onClose={() => setVerificationVisible(false)}
            />
            <ErrorAuthModal
                visible={showErrorModal}
                message={errorMessage}
                onClose={() => setShowErrorModal(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { backgroundColor: '#F7F7F7', padding: 16, borderRadius: 16, borderWidth: 2, borderColor: '#E5E5E5', marginBottom: 20 },
    button: { backgroundColor: '#58CC02', padding: 16, borderRadius: 16, borderBottomWidth: 4, borderBottomColor: '#46A302', alignItems: 'center' },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 }
});