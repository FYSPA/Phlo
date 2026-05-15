import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../../src/services/supabase';

export default function RegisterScreen() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    async function handleSignUp() {
        if (!email || !password || !username) {
            Alert.alert('Error', 'Por favor llena todos los campos');
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username: username }, // Se envía al Trigger de SQL
            },
        });

        if (error) {
            Alert.alert('Error', error.message);
        } else {
            Alert.alert('¡Éxito!', 'Revisa tu correo para confirmar tu cuenta');
            router.replace('/screens/auth/LoginScreen');
        }
        setLoading(false);
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <View style={styles.inner}>
                <Text style={styles.title}>Crea tu perfil</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Nombre de usuario"
                    value={username}
                    onChangeText={setUsername}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Correo electrónico"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
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
                    style={[styles.button, { backgroundColor: '#58CC02', borderBottomColor: '#46A302' }]}
                    onPress={handleSignUp}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>{loading ? 'CREANDO...' : 'CREAR CUENTA'}</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

// Estilos compartidos (puedes moverlos a un archivo aparte luego)
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
    eyeIcon: {
        position: 'absolute',
        right: 15,
        top: 20,
    },
});