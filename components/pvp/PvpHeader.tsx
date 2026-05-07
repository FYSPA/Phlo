import { Trophy, User } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function PvpHeader() {
    return (
        <View style={styles.container}>
            <View style={styles.userInfo}>
                <View style={styles.avatarPlaceholder}>
                    <User color="#FFF" size={24} />
                </View>
                <View>
                    <Text style={styles.username}>Jugador</Text>
                    <Text style={styles.rank}>Liga Bronce III</Text>
                </View>
            </View>
            <View style={styles.stats}>
                <Trophy color="#FFD700" size={20} />
                <Text style={styles.trophies}>1240</Text>
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
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FF0055',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    username: {
        color: '#000000ff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    rank: {
        color: '#A0A0A0',
        fontSize: 12,
    },
    stats: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    trophies: {
        color: '#FFD700',
        fontWeight: 'bold',
        marginLeft: 6,
        fontSize: 16,
    }
});
