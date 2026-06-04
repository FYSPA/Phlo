import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome5 name="arrow-left" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Acerca de</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.logoSection}>
          <FontAwesome5 name="code" size={48} color="#FF0055" />
          <Text style={styles.appName}>Phlo</Text>
          <Text style={styles.version}>Versión 1.0.0</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Desarrollador</Text>
            <Text style={styles.infoValue}>Phlo Team</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Framework</Text>
            <Text style={styles.infoValue}>React Native / Expo</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Entorno</Text>
            <Text style={styles.infoValue}>Expo Go</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Aprende programación de forma interactiva con bloques visuales y
          desafíos PvP. © 2025 Phlo.
        </Text>
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
  logoSection: { alignItems: "center", marginTop: 30, marginBottom: 32 },
  appName: { fontSize: 32, fontWeight: "900", color: "#FF0055", marginTop: 12 },
  version: { fontSize: 14, color: "#909090", marginTop: 4, fontWeight: '500' },
  card: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 4,
    width: "100%",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  infoLabel: { fontSize: 15, color: "#666", fontWeight: 'bold' },
  infoValue: { fontSize: 15, fontWeight: "600", color: "#333" },
  divider: { height: 1, backgroundColor: "#F0F0F0", marginHorizontal: 16 },
  footer: {
    fontSize: 13,
    color: "#909090",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 32,
  },
});
