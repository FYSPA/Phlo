import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as Linking from 'expo-linking';
import { supabase } from '../../src/services/supabase';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleResetRequest = async () => {
        setLoading(true);
        // Creamos la URL correcta dinámica (para Expo Go: exp://..., para instalada: phlo://...)
        const redirectUrl = Linking.createURL('/screens/UpdatePasswordScreen');
        console.log("URL de redirección:", redirectUrl); // Útil para copiar la URL y pegarla en Supabase
        
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: redirectUrl,
        });

        if (error) Alert.alert('Error', error.message);
        else Alert.alert('¡Correo enviado!', 'Revisa tu bandeja de entrada para restablecer tu contraseña.');
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Recuperar contraseña</Text>
            <Text style={styles.subtitle}>Te enviaremos un correo para que puedas crear una nueva.</Text>

            <TextInput
                style={styles.input}
                placeholder="Tu correo electrónico"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
            />

            <TouchableOpacity
                style={[styles.button, { backgroundColor: '#1CB0F6', borderBottomColor: '#1899D6' }]}
                onPress={handleResetRequest}
                disabled={loading}
            >
                <Text style={styles.buttonText}>{loading ? 'ENVIANDO...' : 'ENVIAR CORREO'}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 24, justifyContent: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#4B4B4B', textAlign: 'center' },
    subtitle: { fontSize: 16, color: '#777', textAlign: 'center', marginBottom: 30, marginTop: 10 },
    input: { backgroundColor: '#F7F7F7', padding: 16, borderRadius: 16, borderWidth: 2, borderColor: '#E5E5E5', marginBottom: 20 },
    button: { padding: 16, borderRadius: 16, borderBottomWidth: 4, alignItems: 'center' },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 }
});