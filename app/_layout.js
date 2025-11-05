import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import Navbar from "../components/Navbar";

export default function Layout() {
  return (
    <View style={styles.container}>
      {/* Navbar fixa no topo */}
      <Navbar />

      {/* Stack renderiza as páginas abaixo da Navbar */}
      <View style={styles.content}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1 },
});
