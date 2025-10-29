// screens/HomeScreen.js
import React from "react";
import { View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity, Linking } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <ImageBackground
      source={{ uri: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=60" }}
      style={styles.background}
      blurRadius={1}
    >
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: "https://cdn-icons-png.flaticon.com/512/854/854878.png" }}
              style={styles.logoImg}
            />
            <Text style={styles.logoText}>Guia <Text style={styles.logoSpan}>Cidades</Text></Text>
          </View>

          <View style={styles.nav}>
            <TouchableOpacity onPress={() => { /* navegar */ }} >
              <Text style={[styles.navLink, styles.active]}>Início</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Explorar')}>
              <Text style={styles.navLink}>Explorar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('MyTips')}>
              <Text style={styles.navLink}>Minhas Dicas</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('MyTrips')}>
              <Text style={styles.navLink}>Minhas Viagens</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.navLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.heroSection}>
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>🌍 Guia Turístico</Text>
          <Text style={styles.heroSubtitle}>Descubra cidades incríveis ao redor do mundo</Text>

          <TouchableOpacity
            style={styles.btnExplorar}
            onPress={() => navigation.navigate('Explorar')}
          >
            <Text style={styles.btnText}>Começar a Explorar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 Guia Turístico — Todos os direitos reservados.</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "space-between",
  },
  header: {
    backgroundColor: "#c7a008", // dourado
  },
  headerInner: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoImg: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  logoText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 8,
  },
  logoSpan: {
    color: "#fff",
    fontWeight: "600",
  },
  nav: {
    flexDirection: "row",
    gap: 18,
    alignItems: "center",
  },
  navLink: {
    color: "#fff",
    fontWeight: "600",
    marginHorizontal: 8,
  },
  active: {
    textDecorationLine: "underline"
  },
  heroSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  heroContent: {
    backgroundColor: "rgba(0,0,0,0.45)",
    padding: 28,
    borderRadius: 14,
    alignItems: "center",
    maxWidth: 920,
    width: "100%",
  },
  heroTitle: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
  },
  heroSubtitle: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 18,
    textAlign: "center",
  },
  btnExplorar: {
    backgroundColor: "#1A144B",
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 25,
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
  },
  footer: {
    backgroundColor: "#222",
    paddingVertical: 12,
    alignItems: "center",
  },
  footerText: {
    color: "#fff",
  }
});
