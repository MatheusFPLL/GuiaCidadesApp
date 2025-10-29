// screens/MyTipsScreen.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function MyTipsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Dicas 🌎</Text>
      <Text style={styles.subtitle}>
        Aqui você verá suas dicas salvas e poderá adicionar novas sugestões de viagem.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
