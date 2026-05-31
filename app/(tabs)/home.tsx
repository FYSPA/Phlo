import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LevelModal from "../../components/map/LevelModal";
import { courseService } from "../../src/services/courseService";

const { width } = Dimensions.get("window");

export default function LearnMap() {
  const [lessons, setLessons] = useState<any[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<any | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadLessons();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadLessons();
    }, []),
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

  const renderLevel = ({ item, index }: { item: any; index: number }) => {
    const isCompleted = item.user_progress?.length > 0;
    const isLocked = index > 0 && !lessons[index - 1].user_progress?.length;

    const hasNext = index < lessons.length - 1;
    let distance = 0;
    let angleDegrees = 0;

    if (hasNext) {
      const currentX = getOffsetX(index);
      const nextX = getOffsetX(index + 1);
      const deltaX = nextX - currentX;
      const deltaY = 145; // Distancia vertical aproximada entre nodos
      distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const angle = Math.atan2(deltaX, deltaY);
      angleDegrees = -(angle * 180) / Math.PI;
    }

    return (
      <View
        style={[
          styles.levelWrapper,
          {
            transform: [{ translateX: getOffsetX(index) }],
            position: "relative",
          },
        ]}
      >
        {hasNext && (
          <View
            style={[
              styles.pathLine,
              {
                height: distance,
                backgroundColor: isCompleted ? "#58CC02" : "#E5E5E5",
                transform: [{ rotate: `${angleDegrees}deg` }],
              },
            ]}
          />
        )}
        <TouchableOpacity
          style={[
            styles.levelNode,
            isLocked
              ? styles.nodeLocked
              : isCompleted
                ? styles.nodeCompleted
                : styles.nodeCurrent,
          ]}
          onPress={() =>
            !isLocked &&
            setSelectedLevel({
              id: item.id,
              title: item.title,
              levelNumber: index + 1,
              isCompleted,
            })
          }
          disabled={isLocked}
        >
          <Text style={styles.levelNumber}>{index + 1}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Leccion 1</Text>
      </View>

      <FlatList
        data={lessons}
        renderItem={renderLevel}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{
          paddingVertical: 40,
          paddingHorizontal: 20, // Añade espacio a los lados
          alignItems: "center", // Centra la columna principal
        }}
        showsVerticalScrollIndicator={false}
        // Optimización: Solo renderiza lo que está cerca de la pantalla
        initialNumToRender={10}
        windowSize={5}
      />

      <LevelModal
        visible={selectedLevel !== null}
        onClose={() => setSelectedLevel(null)}
        onStart={() => {
          if (selectedLevel) {
            router.push(
              `/screens/exercise/ExerciseScreen?id=${selectedLevel.id}`,
            );
            setSelectedLevel(null);
          }
        }}
        levelNumber={selectedLevel?.levelNumber || 0}
        levelTitle={selectedLevel?.title || ""}
        isCompleted={selectedLevel?.isCompleted || false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    borderRadius: 80,
    marginTop: 60,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: "#58CC02",
    alignItems: "center",
    borderBottomWidth: 4,
    borderBottomColor: "#46A302",
    width: 300,
    alignSelf: "center",
  },
  headerTitle: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  mapList: { paddingVertical: 40, alignItems: "center" },
  levelWrapper: { alignItems: "center", marginBottom: 40, width: width },
  pathLine: {
    position: "absolute",
    top: 37.5,
    width: 15,
    zIndex: -1,
    transformOrigin: "top center",
    borderRadius: 8,
  },
  levelNode: {
    width: 80,
    height: 75,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
    borderBottomWidth: 8, // Sombra gruesa estilo Duo
  },
  nodeCompleted: { backgroundColor: "#58CC02", borderBottomColor: "#46A302" },
  nodeCurrent: { backgroundColor: "#1CB0F6", borderBottomColor: "#1899D6" },
  nodeLocked: { backgroundColor: "#E5E5E5", borderBottomColor: "#AFAFAF" },
  levelNumber: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  lessonTitle: {
    marginTop: 10,
    fontWeight: "bold",
    color: "#4B4B4B",
    fontSize: 16,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    padding: 2,
    borderRadius: 20,
    //backdropFilter: "blur(20px)",
  },
  lessonTitleContainer: {},
});
