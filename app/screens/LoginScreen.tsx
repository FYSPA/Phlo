import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../src/services/supabase';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleLogin() {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            Alert.alert('Error', 'Credenciales incorrectas');
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

                <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#1CB0F6', borderBottomColor: '#1899D6' }]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>{loading ? 'ENTRANDO...' : 'INICIAR SESIÓN'}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('/screens/RegisterScreen')}>
                    <Text style={styles.linkText}>¿No tienes cuenta? Regístrate</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('/screens/ForgotPasswordScreen')}>
                    <Text style={styles.linkText}>Se te olvido la contraseña? Restablecer</Text>
                </TouchableOpacity>
            </View>
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
    linkText: { color: '#1CB0F6', textAlign: 'center', marginTop: 20, fontWeight: 'bold' }
});