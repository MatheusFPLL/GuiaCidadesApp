import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter, usePathname } from "expo-router";

export default function Navbar() {
  const router = useRouter();
  const currentPath = usePathname();

  return (
    <View style={styles.header}>
      <View style={styles.headerInner}>
        {/* LOGO */}
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/854/854878.png" }}
            style={styles.logoImg}
          />
          <Text style={styles.logo}>
            Guia <Text style={styles.logoSpan}>Cidades</Text>
          </Text>
        </View>

        {/* MENU */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.navList}>
          <TouchableOpacity onPress={() => router.push("/")}>
            <Text style={[styles.navItem, currentPath === "/" && styles.active]}>Início</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/explorar")}>
            <Text style={[styles.navItem, currentPath === "/explorar" && styles.active]}>Explorar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/minhas-dicas")}>
            <Text style={[styles.navItem, currentPath === "/minhas-dicas" && styles.active]}>Minhas Dicas</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/minhas-viagens")}>
            <Text style={[styles.navItem, currentPath === "/minhas-viagens" && styles.active]}>Minhas Viagens</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={[styles.navItem, currentPath === "/login" && styles.active]}>Login</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#c7a008",
    paddingVertical: 15,
    paddingHorizontal: 10,
    elevation: 5,
  },
  headerInner: {
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  logoImg: {
    width: 40,
    height: 40,
  },
  logo: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "700",
  },
  logoSpan: {
    fontWeight: "600",
  },
  navList: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  navItem: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
    paddingHorizontal: 10,
  },
  active: {
    textDecorationLine: "underline",
  },
});
