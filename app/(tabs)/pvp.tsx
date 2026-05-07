import { Swords } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import MatchFoundVS from '../../components/pvp/MatchFoundVS';
import PvpHeader from '../../components/pvp/PvpHeader';
import SearchingRadar from '../../components/pvp/SearchingRadar';

type PvpState = 'idle' | 'searching' | 'found';

export default function PvP() {
    const [matchState, setMatchState] = useState<PvpState>('idle');

    useEffect(() => {
        if (matchState === 'searching') {
            // Simulamos que tarda 3 segundos en encontrar un oponente
            const timer = setTimeout(() => {
                setMatchState('found');
            }, 3000);
            return () => clearTimeout(timer);
        } else if (matchState === 'found') {
            // Aquí iría el router.push('/screens/PvpBattleScreen')
            // Por ahora, reiniciamos después de 5 segundos para fines de demostración
            const timer = setTimeout(() => {
                setMatchState('idle');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [matchState]);

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
        backgroundColor: '#ffffffff', // Fondo oscuro Cyber
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
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    seasonSubtitle: {
        color: '#00E5FF',
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
        shadowColor: '#FF0055',
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
    }
});