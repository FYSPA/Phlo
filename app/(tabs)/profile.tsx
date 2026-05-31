import ErrorPropsModal from "@/components/common/ErrorPropsModal";
import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LeagueCard from "../../components/profile/LeagueCard";
import { ProfileHeader } from "../../components/profile/ProfileHeader";
import { StatCard } from "../../components/profile/StatCard";
import { authService } from "../../src/services/authService";
import { getLeagueInfo } from "../../src/utils/pvpUtils";

export default function ProfileScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const data = await authService.getUserProfile();
      setProfile(data);
    } catch (e: any) {
      setShowErrorModal(true);
      setErrorMessage(e.message || "No se puede cargar el perfil");
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#58CC02" />
      </View>
    );

  const leagueInfo = getLeagueInfo(profile?.league_points || 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => router.push("/screens/settings/SettigsScreen")}
        >
          <FontAwesome5 name="cog" size={24} color="black" />
        </TouchableOpacity>
        <ProfileHeader username={profile?.username} />

        <LeagueCard
          leagueName={leagueInfo.name}
          division={leagueInfo.division}
          points={leagueInfo.points}
          progress={leagueInfo.progress}
        />

        <View style={styles.statsGrid}>
          <StatCard icon="🔥" value={profile?.streak || 0} label="Racha" />
          <StatCard icon="⚡" value={profile?.xp || 0} label="Total XP" />
          <StatCard icon="💎" value={profile?.gems || 0} label="Gemas" />
          <StatCard
            icon="🎮"
            value={profile?.current_streak || 0}
            label="Partidas"
          />
        </View>

        <ErrorPropsModal
          visible={showErrorModal}
          message={errorMessage}
          onClose={() => setShowErrorModal(false)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    padding: 20,
    alignItems: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 30,
  },
  settingsButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
});
