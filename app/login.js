// app/login.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  Alert
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login as apiLogin } from "../services/api";
import { FontAwesome } from "@expo/vector-icons";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email || !password) {
      Alert.alert("Atenção", "Preencha e-mail e senha.");
      return;
    }
    setLoading(true);
    try {
      const res = await apiLogin(email.trim(), password);
      // espera { token, user } ou { message }
      if (res && res.token) {
        // salva token localmente
        await AsyncStorage.setItem("token", res.token);
        if (remember) {
          await AsyncStorage.setItem("remember_me", "1");
        } else {
          await AsyncStorage.removeItem("remember_me");
        }
        Alert.alert("Sucesso", "Logado com sucesso!");
        // navegar para a tela inicial ou voltar
        router.replace("/");
      } else {
        Alert.alert("Erro", res?.message || "Credenciais inválidas");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Falha de conexão com o servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ImageBackground
      source={{ uri: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1200&q=60" }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* back icon */}
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <FontAwesome name="arrow-left" size={18} color="#a4893d" />
          </TouchableOpacity>

          <Text style={styles.brand}>Guia de Cidades</Text>
          <Text style={styles.heading}>Login</Text>

          <View style={styles.inputGroup}>
            <FontAwesome name="user" size={18} color="#a4893d" style={{ marginRight: 10 }} />
            <TextInput
              placeholder="Usuário (email)"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputGroup}>
            <FontAwesome name="lock" size={18} color="#a4893d" style={{ marginRight: 10 }} />
            <TextInput
              placeholder="Senha"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              returnKeyType="done"
            />
          </View>

          <View style={styles.options}>
            <TouchableOpacity onPress={() => setRemember(!remember)} style={styles.checkboxRow}>
              <View style={[styles.checkbox, remember && styles.checkboxChecked]}>
                {remember && <View style={styles.checkboxTick} />}
              </View>
              <Text style={styles.optionText}>Lembrar-me</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => Alert.alert("Recuperação", "Funcionalidade de recuperação não implementada ainda.")}>
              <Text style={styles.forgot}>Esqueceu a senha?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.btn} onPress={handleSubmit} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Entrar</Text>}
          </TouchableOpacity>

          <Text style={styles.signupText}>
            ou <Text style={styles.signupLink} onPress={() => router.push("/cadastro")}>Cadastre-se</Text>
          </Text>
        </View>

        {/* imagem lateral / seção visual (baixo no mobile) */}
        <View style={styles.imageSection} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.18)",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 28,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  brand: {
    color: "#a4893d",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },
  heading: {
    color: "#333",
    fontSize: 18,
    marginBottom: 18,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#222",
  },
  options: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  checkboxRow: { flexDirection: "row", alignItems: "center" },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#a4893d",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#a4893d",
    borderColor: "#a4893d",
  },
  checkboxTick: {
    width: 6,
    height: 10,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#fff",
    transform: [{ rotate: "-45deg" }],
    marginBottom: 2,
  },
  optionText: { color: "#333" },
  forgot: { color: "#a4893d" },
  btn: {
    backgroundColor: "#a4893d",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  signupText: { textAlign: "center", marginTop: 12, color: "#555" },
  signupLink: { color: "#a4893d", fontWeight: "600" },

  imageSection: {
    height: 160,
    borderRadius: 16,
    backgroundColor: "#00000022",
    overflow: "hidden",
  },

    signupLink: { color: "#a4893d", fontWeight: "600" },

  imageSection: {
    height: 160,
    borderRadius: 16,
    backgroundColor: "#00000022",
    overflow: "hidden",
  },
});

