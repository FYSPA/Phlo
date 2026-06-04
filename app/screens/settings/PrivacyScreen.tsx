import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrivacyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome5 name="arrow-left" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Privacidad</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.content}>
        <FontAwesome5 name="lock" size={48} color="#1CB0F6" style={styles.icon} />
        <Text style={styles.heading}>Tu privacidad es importante</Text>
        <Text style={styles.paragraph}>
          Phlo recopila únicamente los datos necesarios para tu experiencia de
          aprendizaje: progreso en lecciones, puntuaciones y estadísticas de
          cuenta.
        </Text>
        <Text style={styles.paragraph}>
          No compartimos tu información personal con terceros sin tu
          consentimiento explícito.
        </Text>

        <View style={styles.card}>
          <View style={styles.cardRow}>
            <FontAwesome5 name="database" size={16} color="#58CC02" />
            <Text style={styles.cardText}>Datos almacenados de forma segura</Text>
          </View>
          <View style={styles.cardRow}>
            <FontAwesome5 name="user-secret" size={16} color="#58CC02" />
            <Text style={styles.cardText}>Nunca compartimos tu información</Text>
          </View>
          <View style={styles.cardRow}>
            <FontAwesome5 name="trash-alt" size={16} color="#58CC02" />
            <Text style={styles.cardText}>Puedes solicitar la eliminación de tus datos</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  title: { fontSize: 20, fontWeight: "bold", color: "#333" },
  content: { flex: 1, padding: 24, alignItems: "center" },
  icon: { marginBottom: 20, marginTop: 20 },
  heading: { fontSize: 22, fontWeight: "bold", color: "#333", textAlign: "center", marginBottom: 16 },
  paragraph: { fontSize: 15, color: "#666", textAlign: "center", lineHeight: 22, marginBottom: 12 },
  card: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    marginTop: 20,
    gap: 16,
  },
  cardRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  cardText: { fontSize: 14, color: "#4B4B4B", fontWeight: "500", flex: 1 },
});
