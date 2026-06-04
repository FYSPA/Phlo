import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SupportScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome5 name="arrow-left" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Soporte</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.option} onPress={() => Linking.openURL("mailto:support@phlo.app")}>
          <FontAwesome5 name="envelope" size={20} color="#1CB0F6" />
          <View style={styles.optionText}>
            <Text style={styles.optionLabel}>Contacto por correo</Text>
            <Text style={styles.optionDesc}>support@phlo.app</Text>
          </View>
          <FontAwesome5 name="external-link-alt" size={14} color="#909090" />
        </TouchableOpacity>

        <View style={styles.divider} />

        <View style={styles.faq}>
          <Text style={styles.faqTitle}>Preguntas frecuentes</Text>

          <View style={styles.faqItem}>
            <Text style={styles.faqQ}>¿Cómo reinicio mi progreso?</Text>
            <Text style={styles.faqA}>
              Ve a Ajustes y selecciona "Restablecer progreso" en la sección de
              cuenta. Esto borrará todo tu avance.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQ}>¿Cómo cambio mi contraseña?</Text>
            <Text style={styles.faqA}>
              Puedes restablecerla desde la pantalla de inicio de sesión
              seleccionando "¿Se te olvidó la contraseña?".
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQ}>¿Pierdo mi progreso si cierro sesión?</Text>
            <Text style={styles.faqA}>
              No, tu progreso está ligado a tu cuenta. Al iniciar sesión de
              nuevo, todo estará ahí.
            </Text>
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
  content: { flex: 1, padding: 20 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    gap: 14,
  },
  optionText: { flex: 1 },
  optionLabel: { fontSize: 16, fontWeight: "600", color: "#242424" },
  optionDesc: { fontSize: 13, color: "#909090", marginTop: 2 },
  divider: { height: 1, backgroundColor: "#F0F0F0", marginVertical: 20 },
  faq: { gap: 16 },
  faqTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#909090",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  faqItem: {
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    padding: 16,
  },
  faqQ: { fontSize: 15, fontWeight: "600", color: "#333", marginBottom: 6 },
  faqA: { fontSize: 14, color: "#666", lineHeight: 20 },
});
