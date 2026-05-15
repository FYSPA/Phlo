import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { LeagueTier } from '../../src/types/pvp';
import { getLeagueName } from '../../src/utils/pvpUtils';

interface Props {
    visible: boolean;
    isVictory: boolean;
    isTie: boolean;
    xpEarned: number;
    gemsEarned: number;
    leaguePointsEarned: number;
    newLeague: LeagueTier;
    onPlayAgain: () => void;
    onExit: () => void;
}

export default function BattleResultModal({
    visible,
    isVictory,
    isTie,
    xpEarned,
    gemsEarned,
    leaguePointsEarned,
    newLeague,
    onPlayAgain,
    onExit,
}: Props) {
    const resultText = isVictory ? '¡VICTORIA!' : isTie ? 'EMPATE' : 'DERROTA';
    const resultColor = isVictory ? '#58CC02' : isTie ? '#FF9600' : '#FF4B4B';

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={[styles.resultTitle, { color: resultColor }]}>{resultText}</Text>

                    <View style={styles.rewardsContainer}>
                        <View style={styles.rewardRow}>
                            <Text style={styles.rewardLabel}>XP</Text>
                            <Text style={styles.rewardValue}>+{xpEarned}</Text>
                        </View>
                        <View style={styles.rewardRow}>
                            <Text style={styles.rewardLabel}>Gemas</Text>
                            <Text style={styles.rewardValue}>+{gemsEarned}</Text>
                        </View>
                        <View style={styles.rewardRow}>
                            <Text style={styles.rewardLabel}>Liga</Text>
                            <Text style={[styles.rewardValue, leaguePointsEarned >= 0 ? styles.positive : styles.negative]}>
                                {leaguePointsEarned >= 0 ? '+' : ''}{leaguePointsEarned}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.leagueSection}>
                        <Text style={styles.leagueLabel}>Liga actual</Text>
                        <View style={[styles.leagueBadge, { backgroundColor: resultColor }]}>
                            <Text style={styles.leagueName}>{getLeagueName(newLeague)}</Text>
                        </View>
                    </View>

                    <View style={styles.buttonsRow}>
                        <TouchableOpacity style={styles.exitBtn} onPress={onExit}>
                            <Text style={styles.exitBtnText}>Salir</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.playAgainBtn, { backgroundColor: resultColor }]} onPress={onPlayAgain}>
                            <Text style={styles.playAgainBtnText}>Jugar otra vez</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 30,
        width: '85%',
        alignItems: 'center',
    },
    resultTitle: {
        fontSize: 32,
        fontWeight: '900',
        marginBottom: 25,
    },
    rewardsContainer: {
        width: '100%',
        marginBottom: 20,
    },
    rewardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    rewardLabel: {
        fontSize: 16,
        color: '#666',
    },
    rewardValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#222',
    },
    positive: {
        color: '#58CC02',
    },
    negative: {
        color: '#FF4B4B',
    },
    leagueSection: {
        alignItems: 'center',
        marginBottom: 25,
    },
    leagueLabel: {
        fontSize: 12,
        color: '#888',
        marginBottom: 8,
    },
    leagueBadge: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
    },
    leagueName: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    buttonsRow: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    exitBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#F0F0F0',
        alignItems: 'center',
    },
    exitBtnText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
    },
    playAgainBtn: {
        flex: 2,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    playAgainBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
});