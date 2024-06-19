import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Image, Platform } from "react-native";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { RetroTextInput } from "@/components/TextInput";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsTab() {
  const [plaidClientId, setPlaidClientId] = useState("");
  const [plaidSecret, setPlaidSecret] = useState("");
  const [plaidAccessToken, setPlaidAccessToken] = useState("");

  const storePlaidClientId = async (clientId: string) => {
    setPlaidClientId(clientId);
    await AsyncStorage.setItem("plaidClientId", clientId);
  };

  const storePlaidSecret = async (secret: string) => {
    setPlaidSecret(secret);
    await AsyncStorage.setItem("plaidSecret", secret);
  };

  const storePlaidAccessToken = async (accessToken: string) => {
    setPlaidAccessToken(accessToken);
    await AsyncStorage.setItem("plaidAccessToken", accessToken);
  };

  const fetchPlaidClientId = async () => {
    const clientId = await AsyncStorage.getItem("plaidClientId");
    setPlaidClientId(clientId ?? "");
  };

  const fetchPlaidSecret = async () => {
    const secret = await AsyncStorage.getItem("plaidSecret");
    setPlaidSecret(secret ?? "");
  };

  const fetchPlaidAccessToken = async () => {
    const accessToken = await AsyncStorage.getItem("plaidAccessToken");
    setPlaidAccessToken(accessToken ?? "");
  };

  useEffect(() => {
    fetchPlaidClientId();
    fetchPlaidSecret();
    fetchPlaidAccessToken();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Ionicons size={310} name="settings" style={styles.headerImage} />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Settings</ThemedText>
      </ThemedView>
      <ThemedText>
        This app includes example code to help you get started.
      </ThemedText>
      <Collapsible title="Plaid API Keys">
        <ThemedText>Client ID</ThemedText>
        <RetroTextInput
          placeholder="Type here..."
          placeholderTextColor="#00FF00"
          onChangeText={storePlaidClientId}
          value={plaidClientId}
        />
        <ThemedText>Secret</ThemedText>
        <RetroTextInput
          placeholder="Type here..."
          placeholderTextColor="#00FF00"
          onChangeText={storePlaidSecret}
          value={plaidSecret}
        />
        <ThemedText>Access Token</ThemedText>
        <RetroTextInput
          placeholder="Type here..."
          placeholderTextColor="#00FF00"
          onChangeText={storePlaidAccessToken}
          value={plaidAccessToken}
        />
        <ThemedText>
          <ExternalLink href="https://plaid.com/docs/quickstart">
            Get your Plaid API keys
          </ExternalLink>
        </ThemedText>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
