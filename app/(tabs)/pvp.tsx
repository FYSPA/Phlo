import { Swords } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import MatchFoundVS from '../../components/pvp/MatchFoundVS';
import PvpHeader from '../../components/pvp/PvpHeader';
import SearchingRadar from '../../components/pvp/SearchingRadar';
import { supabase } from '../../src/services/supabase';

type PvpState = 'idle' | 'searching' | 'found';

export default function PvP() {
    const router = useRouter();
    const [matchState, setMatchState] = useState<PvpState>('idle');
    const [userId, setUserId] = useState<string | null>(null);
    const [userLeaguePoints, setUserLeaguePoints] = useState(0);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setUserId(user.id);
            const { data: profile } = await supabase
                .from('profiles')
                .select('league_points')
                .eq('id', user.id)
                .single();
            if (profile) {
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
            <PvpHeader />

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
                            <Swords color="#FFF" size={28} style={styles.btnIcon} />
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
        backgroundColor: '#ffffffff',
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
        marginBottom: 80,
    },
    seasonTitle: {
        color: '#000000ff',
        fontSize: 32,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 2,
        textShadowRadius: 10,
    },
    seasonSubtitle: {
        color: '#000000ff',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 8,
        letterSpacing: 1,
    },
    findMatchBtn: {
        backgroundColor: '#FF0055',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 18,
        paddingHorizontal: 32,
        borderRadius: 35,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 15,
        elevation: 10,
    },
    btnIcon: {
        marginRight: 12,
    },
    findMatchText: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: '900',
        letterSpacing: 1,
    },
    modeSelector: {
        marginTop: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#F0F0F0',
        borderRadius: 20,
    },
    modeLabel: {
        fontSize: 14,
        color: '#666',
        fontWeight: '600',
    },
});