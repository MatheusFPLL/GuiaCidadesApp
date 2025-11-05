import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, ImageBackground } from "react-native";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();
  const bounceAnim = useRef(new Animated.Value(1)).current;

  // Animação saltitante infinita
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [bounceAnim]);

  return (
    <View style={styles.container}>
      {/* Imagem de fundo da praia */}
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        }}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Overlay escuro para contraste */}
        <View style={styles.overlay}>
          <View style={styles.heroContent}>
            <Text style={styles.title}>🌍 Guia Turístico</Text>
            <Text style={styles.subtitle}>Descubra cidades incríveis ao redor do mundo</Text>

            {/* Botão com animação saltitante */}
            <Animated.View style={{ transform: [{ scale: bounceAnim }] }}>
              <TouchableOpacity
                style={styles.btnExplorar}
                onPress={() => router.push("/explorar")}
              >
                <Text style={styles.btnText}>Começar a Explorar</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Rodapé fixo */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              © 2025 Guia Cidades — Todos os direitos reservados.
            </Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "space-between",
  },

  heroContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 36,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginBottom: 25,
  },

  btnExplorar: {
    backgroundColor: "#1A144B",
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },

  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  footer: {
    backgroundColor: "#222",
    paddingVertical: 14,
    alignItems: "center",
  },

  footerText: {
    color: "#fff",
    fontSize: 13,
  },
});
