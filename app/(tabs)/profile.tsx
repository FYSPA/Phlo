import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '../../src/services/authService';
import { getLeagueInfo } from '../../src/utils/pvpUtils';
import { ProfileHeader } from '../../components/profile/ProfileHeader';
import { StatCard } from '../../components/profile/StatCard';
import { SignOutButton } from '../../components/profile/SignOutButton';
import LeagueCard from '../../components/profile/LeagueCard';

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

    async function handleSignOut() {
        try {
            await authService.signOut();
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    }

    if (loading) return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#58CC02" />
        </View>
    );

    const leagueInfo = getLeagueInfo(profile?.league_points || 0);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                <ProfileHeader username={profile?.username} />

                <LeagueCard
                    leagueName={leagueInfo.name}
                    division={leagueInfo.division}
                    points={leagueInfo.points}
                    progress={leagueInfo.progress}
                />

                <View style={styles.statsGrid}>
                    <StatCard icon="🔥" value={profile?.streak || 0} label="Racha" />
                    <StatCard icon="⚡" value={profile?.xp || 0} label="Total XP" />
                    <StatCard icon="💎" value={profile?.gems || 0} label="Gemas" />
                    <StatCard icon="🎮" value={profile?.current_streak || 0} label="Partidas" />
                </View>

                <SignOutButton onPress={handleSignOut} />

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    scrollContent: {
        padding: 20,
        alignItems: 'center'
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 30
    },
});