import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface SignOutButtonProps {
    onPress: () => void;
    title?: string;
}

export const SignOutButton: React.FC<SignOutButtonProps> = ({ onPress, title = 'CERRAR SESIÓN' }) => {
    return (
        <TouchableOpacity style={styles.signOutButton} onPress={onPress}>
            <Text style={styles.signOutText}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    signOutButton: {
        width: '100%',
        backgroundColor: '#fff',
        borderColor: '#FF4B4B',
        borderWidth: 2,
        borderBottomWidth: 5,
        borderRadius: 15,
        padding: 16,
        alignItems: 'center',
        marginTop: 10
    },
    signOutText: {
        color: '#FF4B4B',
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 1
    }
});
