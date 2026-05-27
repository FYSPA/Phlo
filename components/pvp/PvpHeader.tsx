import { Trophy, User } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface PvpHeaderProps {
    username: string;
    rank: string;
    trophies: number;
}

export default function PvpHeader({ username, rank, trophies }: PvpHeaderProps) {
    return (
        <View style={styles.container}>
            <View style={styles.userInfo}>
                <View style={styles.avatarPlaceholder}>
                    <User color="#FFF" size={24}  {...({ color: '#FFF' } as any)} />
                </View>
                <View>
                    <Text style={styles.username}>{username}</Text>
                    <Text style={styles.rank}>{rank}</Text>
                </View>
            </View>
            <View style={styles.stats}>
                <Trophy color="#FFD700" size={20} {...({ color: '#FFD700' } as any)} />
                <Text style={styles.trophies}>{trophies}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#6366F1',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    username: {
        color: '#1F2937',
        fontSize: 18,
        fontWeight: 'bold',
    },
    rank: {
        color: '#6B7280',
        fontSize: 12,
    },
    stats: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    trophies: {
        color: '#B45309',
        fontWeight: 'bold',
        marginLeft: 6,
        fontSize: 16,
    }
});
