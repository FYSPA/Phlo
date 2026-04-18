import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { authService } from '../../src/services/authService';

export default function ProfileScreen() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const data = await authService.getUserProfile();
            setProfile(data);
        } catch (error: any) {
            Alert.alert('Error', 'No se pudo cargar el perfil');
        } finally {
            setLoading(false);
        }
    }

    // FUNCIÓN DE CERRAR SESIÓN USANDO EL BACKEND
    async function handleSignOut() {
        try {
            await authService.signOut();
            // No necesitas redirigir manualmente, el _layout.tsx lo hará solo
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    }

    if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.username}>{profile?.username || 'Usuario'}</Text>
                <Text style={styles.xpText}>{profile?.xp} XP Totales</Text>
            </View>

            {/* Botón de Logout */}
            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                <Text style={styles.signOutText}>CERRAR SESIÓN</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 20, justifyContent: 'center' },
    header: { alignItems: 'center', marginBottom: 50 },
    username: { fontSize: 28, fontWeight: 'bold', color: '#4B4B4B' },
    xpText: { fontSize: 18, color: '#777' },
    signOutButton: {
        borderColor: '#ff4b4b',
        borderWidth: 2,
        borderBottomWidth: 5,
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
    },
    signOutText: { color: '#ff4b4b', fontWeight: 'bold', fontSize: 16 }
});