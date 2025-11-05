// app/cadastro.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { register as apiRegister } from "../services/api";
import { FontAwesome } from "@expo/vector-icons";

export default function Cadastro() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const validarEmail = (e) => {
    return /\S+@\S+\.\S+/.test(e);
  };

  async function handleRegister() {
  if (!name.trim() || !email.trim() || !password) {
    Alert.alert("Atenção", "Preencha nome, e-mail e senha.");
    return;
  }
  setLoading(true);
  try {
    console.log("-> enviando register para API", { name, email });
    const res = await apiRegister({ name: name.trim(), email: email.trim(), password });
    console.log("<< resposta register:", res);
    if (res && res.token) {
      await AsyncStorage.setItem("token", res.token);
      await AsyncStorage.setItem("userLogged", JSON.stringify(res.user || { name, email }));
      if (remember) await AsyncStorage.setItem("remember_me", "1");
      Alert.alert("Sucesso", "Conta criada com sucesso!");
      router.replace("/");
    } else {
      Alert.alert("Erro", res?.message || JSON.stringify(res) || "Resposta inesperada");
    }
  } catch (err) {
    console.error("handleRegister erro:", err);
    Alert.alert("Erro ao registrar", err.message || JSON.stringify(err));
  } finally {
    setLoading(false);
  }
}

  return (
    <ImageBackground
      source={{
        uri:
          "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1200&q=60",
      }}
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
          <Text style={styles.heading}>Criar Conta</Text>

          <View style={styles.inputGroup}>
            <FontAwesome name="user" size={18} color="#a4893d" style={{ marginRight: 10 }} />
            <TextInput
              placeholder="Nome completo"
              placeholderTextColor="#666"
              value={name}
              onChangeText={setName}
              style={styles.input}
              autoCapitalize="words"
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputGroup}>
            <FontAwesome name="envelope" size={18} color="#a4893d" style={{ marginRight: 10 }} />
            <TextInput
              placeholder="E-mail"
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
              placeholder="Senha (mín. 6 caracteres)"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputGroup}>
            <FontAwesome name="lock" size={18} color="#a4893d" style={{ marginRight: 10 }} />
            <TextInput
              placeholder="Confirme a senha"
              placeholderTextColor="#666"
              value={password2}
              onChangeText={setPassword2}
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

            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={styles.forgot}>Já tem conta? Entrar</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.btn} onPress={handleRegister} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Criar conta</Text>}
          </TouchableOpacity>
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
  imageSection: {
    height: 160,
    borderRadius: 16,
    backgroundColor: "#00000022",
    overflow: "hidden",
  },
});
