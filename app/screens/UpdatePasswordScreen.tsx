import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../src/services/supabase';

export default function UpdatePassword() {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleUpdate = async () => {
        setLoading(true);
        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            Alert.alert('Error', error.message);
        } else {
            Alert.alert('¡Éxito!', 'Tu contraseña ha sido actualizada.');
            router.replace('/screens/LoginScreen');
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