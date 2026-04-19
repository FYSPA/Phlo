import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { courseService } from '../../src/services/courseService';

const { width } = Dimensions.get('window');

export default function LearnMap() {
  const [lessons, setLessons] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadLessons();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadLessons();
    }, [])
  );


  async function loadLessons() {
    const data = await courseService.getLevels();
    setLessons(data);
  }

  // Lógica para el movimiento zig-zag
  const getOffsetX = (index: number) => {
    const pattern = [0, 50, 0, -50]; // Centro, Derecha, Centro, Izquierda
    return pattern[index % 4];
  };

  const renderLevel = ({ item, index }: { item: any, index: number }) => {
    const isCompleted = item.user_progress?.length > 0;
    const isLocked = index > 0 && !lessons[index - 1].user_progress?.length;

    return (
      <View style={[styles.levelWrapper, { transform: [{ translateX: getOffsetX(index) }] }]}>
        <TouchableOpacity
          style={[
            styles.levelNode,
            isLocked ? styles.nodeLocked : isCompleted ? styles.nodeCompleted : styles.nodeCurrent
          ]}
          onPress={() => !isLocked && router.push(`/screens/ExerciseScreen?id=${item.id}`)}
          disabled={isLocked}
        >
          <Text style={styles.levelNumber}>{index + 1}</Text>
        </TouchableOpacity>
        <Text style={styles.lessonTitle}>{item.title}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Proximamente Botones o Texto</Text>
      </View>

      <FlatList
        data={lessons}
        renderItem={renderLevel}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{
          paddingVertical: 40,
          paddingHorizontal: 20, // Añade espacio a los lados
          alignItems: 'center',  // Centra la columna principal
        }}
        showsVerticalScrollIndicator={false}
        // Optimización: Solo renderiza lo que está cerca de la pantalla
        initialNumToRender={10}
        windowSize={5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#58CC02',
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: '#46A302'
  },
  headerTitle: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  mapList: { paddingVertical: 40, alignItems: 'center' },
  levelWrapper: { alignItems: 'center', marginBottom: 40, width: width },
  levelNode: {
    width: 80,
    height: 75,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    borderBottomWidth: 8, // Sombra gruesa estilo Duo
  },
  nodeCompleted: { backgroundColor: '#58CC02', borderBottomColor: '#46A302' },
  nodeCurrent: { backgroundColor: '#1CB0F6', borderBottomColor: '#1899D6' },
  nodeLocked: { backgroundColor: '#E5E5E5', borderBottomColor: '#AFAFAF' },
  levelNumber: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  lessonTitle: { marginTop: 10, fontWeight: 'bold', color: '#4B4B4B', fontSize: 16 }
});