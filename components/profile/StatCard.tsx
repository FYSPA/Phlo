import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface StatCardProps {
    icon: string;
    value: string | number;
    label: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, value, label }) => {
    return (
        <View style={styles.statCard}>
            <Text style={styles.statIcon}>{icon}</Text>
            <View>
                <Text style={styles.statValue}>{value}</Text>
                <Text style={styles.statLabel}>{label}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    statCard: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '48%', // Dos columnas
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#E5E5E5',
        borderBottomWidth: 5, // Efecto 3D
        borderRadius: 15,
        padding: 15,
        marginBottom: 15
    },
    statIcon: {
        fontSize: 24,
        marginRight: 10
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4B4B4B'
    },
    statLabel: {
        fontSize: 14,
        color: '#AFAFAF',
        fontWeight: '600'
    }
});
