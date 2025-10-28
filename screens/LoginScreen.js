// screens/LoginScreen.js
import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../services/api";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function doLogin() {
    try {
      const res = await login(email, password);
      if (res.token) {
        await AsyncStorage.setItem("token", res.token);
        Alert.alert("Sucesso", "Logado!");
        navigation.goBack();
      } else {
        Alert.alert("Erro", res.message || "Falha no login");
      }
    } catch (e) { Alert.alert("Erro", e.message); }
  }

  return (
    <View style={{ padding: 16 }}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ padding:12, backgroundColor:'#fff', marginBottom:8 }} />
      <TextInput placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry style={{ padding:12, backgroundColor:'#fff', marginBottom:8 }} />
      <Button title="Entrar" onPress={doLogin} />
      <View style={{height:8}} />
      <Button title="Criar conta" onPress={() => navigation.navigate('Signup')} />
    </View>
  );
}
