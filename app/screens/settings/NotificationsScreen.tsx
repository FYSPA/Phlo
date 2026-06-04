import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationsScreen() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [marketingEnabled, setMarketingEnabled] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome5 name="arrow-left" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Notificaciones</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferencias</Text>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <FontAwesome5 name="bell" size={18} color="#1CB0F6" />
            <View style={styles.rowText}>
              <Text style={styles.rowLabel}>Notificaciones push</Text>
              <Text style={styles.rowDescription}>Alertas de progreso y recordatorios</Text>
            </View>
          </View>
          <Switch
            value={pushEnabled}
            onValueChange={setPushEnabled}
            trackColor={{ false: "#E5E5E5", true: "#58CC02" }}
            thumbColor="#FFF"
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <FontAwesome5 name="envelope" size={18} color="#FF0055" />
            <View style={styles.rowText}>
              <Text style={styles.rowLabel}>Correo electrónico</Text>
              <Text style={styles.rowDescription}>Resumen semanal de actividad</Text>
            </View>
          </View>
          <Switch
            value={emailEnabled}
            onValueChange={setEmailEnabled}
            trackColor={{ false: "#E5E5E5", true: "#58CC02" }}
            thumbColor="#FFF"
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <FontAwesome5 name="bullhorn" size={18} color="#B45309" />
            <View style={styles.rowText}>
              <Text style={styles.rowLabel}>Marketing</Text>
              <Text style={styles.rowDescription}>Ofertas, novedades y promociones</Text>
            </View>
          </View>
          <Switch
            value={marketingEnabled}
            onValueChange={setMarketingEnabled}
            trackColor={{ false: "#E5E5E5", true: "#58CC02" }}
            thumbColor="#FFF"
          />
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
  section: { padding: 20 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#909090",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 14, flex: 1 },
  rowText: { flex: 1 },
  rowLabel: { fontSize: 16, fontWeight: "600", color: "#242424" },
  rowDescription: { fontSize: 13, color: "#909090", marginTop: 2 },
  divider: { height: 1, backgroundColor: "#F5F5F5" },
});
