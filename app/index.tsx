// app/index.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Page() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Aquí podrías poner un logo o una imagen de un robot/personaje */}
        <View style={styles.logoContainer}>
          <Text style={styles.emoji}>🤖</Text>
          <Text style={styles.appName}>Phlo Code</Text>
          <Text style={styles.slogan}>Aprende a programar gratis, para siempre.</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, styles.btnStart]}
          onPress={() => router.push('/screens/RegisterScreen')} // O a una pantalla de Registro
        >
          <Text style={styles.textStart}>Sign up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.btnLogin]}
          onPress={() => router.push('/screens/LoginScreen')}
        >
          <Text style={styles.textLogin}>Log in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  emoji: {
    fontSize: 80,
    marginBottom: 10,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#58CC02',
    letterSpacing: 1,
  },
  slogan: {
    fontSize: 18,
    color: '#777',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  footer: {
    gap: 12,
    marginBottom: 30,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderBottomWidth: 4,
  },
  btnStart: {
    backgroundColor: '#58CC02',
    borderBottomColor: '#46A302',
  },
  textStart: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  btnLogin: {
    backgroundColor: '#fff',
    borderColor: '#E5E5E5',
    borderWidth: 2,
    borderBottomColor: '#E5E5E5',
  },
  textLogin: {
    color: '#1CB0F6',
    fontWeight: 'bold',
    fontSize: 18,
  },
});