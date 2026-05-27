import { useRouter } from 'expo-router';
import { Swords } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import MatchFoundVS from '../../components/pvp/MatchFoundVS';
import PvpHeader from '../../components/pvp/PvpHeader';
import SearchingRadar from '../../components/pvp/SearchingRadar';
import { supabase } from '../../src/services/supabase';
import { getLeagueInfo } from '../../src/utils/pvpUtils';

type PvpState = 'idle' | 'searching' | 'found';

export default function PvP() {
    const router = useRouter();
    const [matchState, setMatchState] = useState<PvpState>('idle');
    const [userId, setUserId] = useState<string | null>(null);
    const [userLeaguePoints, setUserLeaguePoints] = useState(0);
    const [username, setUsername] = useState('Jugador');

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setUserId(user.id);
            const { data: profile } = await supabase
                .from('profiles')
                .select('username, league_points')
                .eq('id', user.id)
                .single();
            if (profile) {
                setUsername(profile.username || user.email?.split('@')[0] || 'Jugador');
                setUserLeaguePoints(profile.league_points);
            }
        }
    };

    useEffect(() => {
        if (matchState === 'searching') {
            const timer = setTimeout(() => {
                setMatchState('found');
            }, 2000);
            return () => clearTimeout(timer);
        } else if (matchState === 'found') {
            const timer = setTimeout(() => {
                if (userId) {
                    router.push({
                        pathname: '/screens/pvp/BattleScreen',
                        params: { userId, leaguePoints: userLeaguePoints },
                    });
                }
                setMatchState('idle');
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [matchState, userId, userLeaguePoints]);

    return (
        <SafeAreaView style={styles.container}>
            <PvpHeader
                username={username}
                rank={`${getLeagueInfo(userLeaguePoints).name} ${getLeagueInfo(userLeaguePoints).division}`}
                trophies={userLeaguePoints}
            />

            <View style={styles.content}>
                {matchState === 'idle' && (
                    <View style={styles.idleContainer}>
                        <View style={styles.seasonInfo}>
                            <Text style={styles.seasonTitle}>Temporada 1</Text>
                            <Text style={styles.seasonSubtitle}>Termina en 14 días</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.findMatchBtn}
                            onPress={() => setMatchState('searching')}
                            activeOpacity={0.8}
                        >
                            <Swords color="#FFF" size={28}  {...({ color: 'red' } as any)} style={styles.btnIcon} />
                            <Text style={styles.findMatchText}>BUSCAR BATALLA</Text>
                        </TouchableOpacity>

                        <View style={styles.modeSelector}>
                            <Text style={styles.modeLabel}>Modo: AI Bot</Text>
                        </View>
                    </View>
                )}

                {matchState === 'searching' && <SearchingRadar />}
                {matchState === 'found' && <MatchFoundVS />}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
    },
    idleContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    seasonInfo: {
        alignItems: 'center',
        marginBottom: 40,
        backgroundColor: '#F9FAFB',
        paddingVertical: 20,
        paddingHorizontal: 40,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    seasonTitle: {
        color: '#1F2937',
        fontSize: 24,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    seasonSubtitle: {
        color: '#6B7280',
        fontSize: 14,
        fontWeight: '600',
        marginTop: 6,
        letterSpacing: 0.5,
    },
    findMatchBtn: {
        backgroundColor: '#4F46E5',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 36,
        borderRadius: 30,
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    btnIcon: {
        marginRight: 10,
    },
    findMatchText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: 1,
    },
    modeSelector: {
        marginTop: 24,
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#F3F4F6',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    modeLabel: {
        fontSize: 13,
        color: '#4B5563',
        fontWeight: '600',
    },
});