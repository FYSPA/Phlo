import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

export default function LoadingScreen() {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animación combinada de rebote y escala para un look más premium
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -30,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ 
        transform: [
          { translateY: bounceAnim },
          { scale: scaleAnim }
        ] 
      }}>
        <Text style={styles.robot}>🤖</Text>
      </Animated.View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>PHLO</Text>
        <View style={styles.dotContainer}>
          <Text style={styles.subtext}>Preparando tus bloques...</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  robot: {
    fontSize: 100,
  },
  textContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  text: {
    fontSize: 28,
    fontWeight: '900',
    color: '#58CC02',
    letterSpacing: 4,
  },
  subtext: {
    fontSize: 16,
    color: '#AFAFAF',
    fontWeight: '600',
    marginTop: 8,
  },
  dotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});
