import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
    p1Score: number;
    p2Score: number;
    currentRound: number;
    maxRounds?: number;
}

export default function PlayerProgress({ p1Score, p2Score, currentRound, maxRounds = 5 }: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.scoreSection}>
                <View style={styles.playerInfo}>
                    <Text style={styles.playerLabel}>TÚ</Text>
                    <Text style={styles.score}>{p1Score}</Text>
                </View>

                <View style={styles.vsContainer}>
                    <Text style={styles.vsText}>VS</Text>
                </View>

                <View style={styles.playerInfo}>
                    <Text style={styles.playerLabel}>PhloBot</Text>
                    <Text style={styles.score}>{p2Score}</Text>
                </View>
            </View>

            <View style={styles.roundsIndicator}>
                {Array.from({ length: maxRounds }, (_, i) => (
                    <View
                        key={i}
                        style={[
                            styles.roundDot,
                            i + 1 === currentRound && styles.currentDot,
                            i < currentRound - 1 && styles.completedDot,
                        ]}
                    />
                ))}
            </View>

            <Text style={styles.roundText}>Ronda {currentRound}/5</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    scoreSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    playerInfo: {
        alignItems: 'center',
        minWidth: 80,
    },
    playerLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 4,
    },
    score: {
        fontSize: 36,
        fontWeight: '900',
        color: '#222',
    },
    vsContainer: {
        marginHorizontal: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FF0055',
        alignItems: 'center',
        justifyContent: 'center',
    },
    vsText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '900',
    },
    roundsIndicator: {
        flexDirection: 'row',
        marginTop: 15,
        gap: 8,
    },
    roundDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#E0E0E0',
    },
    currentDot: {
        backgroundColor: '#FF0055',
        transform: [{ scale: 1.2 }],
    },
    completedDot: {
        backgroundColor: '#58CC02',
    },
    roundText: {
        marginTop: 8,
        fontSize: 12,
        color: '#888',
        fontWeight: '600',
    },
});