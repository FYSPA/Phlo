import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ErrorCredentialsModal from '../../../components/auth/ErrorCredentialsModal';
import { supabase } from '../../../src/services/supabase';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    async function handleLogin() {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            setShowErrorModal(true);
            setErrorMessage(error.message);
        } else {
            // El layout.tsx detectará la sesión y te mandará al mapa automáticamente
        }
        setLoading(false);
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <View style={styles.inner}>
                <Text style={styles.title}>Ingresar</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Correo"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                />

                <View>
                    <TextInput
                        style={styles.input}
                        placeholder="Contraseña"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                        <FontAwesome5 name={showPassword ? "eye-slash" : "eye"} size={20} color="#888" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#1CB0F6', borderBottomColor: '#1899D6' }]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>{loading ? 'ENTRANDO...' : 'INICIAR SESIÓN'}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('/screens/auth/RegisterScreen')}>
                    <Text style={styles.linkText}>¿No tienes cuenta? Regístrate</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('/screens/auth/ForgotPasswordScreen')}>
                    <Text style={styles.linkText}>Se te olvido la contraseña? Restablecer</Text>
                </TouchableOpacity>
            </View>
            <ErrorCredentialsModal
                visible={showErrorModal}
                onClose={() => setShowErrorModal(false)}
            />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    inner: { flex: 1, padding: 24, justifyContent: 'center' },
    title: { fontSize: 28, fontWeight: 'bold', color: '#4B4B4B', textAlign: 'center', marginBottom: 30 },
    input: {
        backgroundColor: '#F7F7F7',
        padding: 16,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#E5E5E5',
        marginBottom: 15,
        fontSize: 16,
    },
    button: {
        paddingVertical: 16,
        borderRadius: 16,
        borderBottomWidth: 4,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
    linkText: { color: '#1CB0F6', textAlign: 'center', marginTop: 20, fontWeight: 'bold' },
    eyeIcon: {
        position: 'absolute',
        right: 15,
        top: 20,
    },
});