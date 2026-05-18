import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface LeagueCardProps {
    leagueName: string;
    division: string;
    points: number;
    progress: number;
}

export default function LeagueCard({ leagueName, division, points, progress }: LeagueCardProps) {
    const leagueColors: Record<string, { bg: string; text: string }> = {
        'Liga Bronce': { bg: '#CD7F32', text: '#8B4513' },
        'Liga Plata': { bg: '#C0C0C0', text: '#808080' },
        'Liga Oro': { bg: '#FFD700', text: '#B8860B' },
        'Liga Diamante': { bg: '#B9F2FF', text: '#4169E1' },
    };

    const colors = leagueColors[leagueName] || leagueColors['Liga Bronce'];

    return (
        <View style={[styles.container, { borderColor: colors.bg }]}>
            <View style={styles.header}>
                <Text style={styles.icon}>🏆</Text>
                <View>
                    <Text style={[styles.leagueName, { color: colors.text }]}>{leagueName}</Text>
                    <Text style={styles.division}>División {division}</Text>
                </View>
            </View>

            <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { backgroundColor: '#E0E0E0' }]}>
                    <View
                        style={[
                            styles.progressFill,
                            { width: `${progress}%`, backgroundColor: colors.bg }
                        ]}
                    />
                </View>
                <Text style={styles.pointsText}>{points} pts</Text>
            </View>

            <Text style={styles.hint}>
                {Math.round(100 - progress)} pts para la siguiente división
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#fff',
        borderWidth: 3,
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    icon: {
        fontSize: 32,
        marginRight: 12,
    },
    leagueName: {
        fontSize: 20,
        fontWeight: '900',
    },
    division: {
        fontSize: 14,
        color: '#888',
        fontWeight: '600',
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    progressBar: {
        flex: 1,
        height: 12,
        borderRadius: 6,
        overflow: 'hidden',
        marginRight: 10,
    },
    progressFill: {
        height: '100%',
        borderRadius: 6,
    },
    pointsText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#444',
        minWidth: 60,
        textAlign: 'right',
    },
    hint: {
        fontSize: 12,
        color: '#AAA',
        textAlign: 'center',
    },
});