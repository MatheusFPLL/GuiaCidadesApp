// screens/SignupScreen.js
import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { register } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function doSignup() {
    try {
      const res = await register(email, password);
      if (res.token) {
        await AsyncStorage.setItem("token", res.token);
        Alert.alert("Sucesso", "Conta criada!");
        navigation.goBack();
      } else {
        Alert.alert("Erro", res.message || "Falha ao registrar");
      }
    } catch (e) { Alert.alert("Erro", e.message); }
  }

  return (
    <View style={{ padding: 16 }}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ padding:12, backgroundColor:'#fff', marginBottom:8 }} />
      <TextInput placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry style={{ padding:12, backgroundColor:'#fff', marginBottom:8 }} />
      <Button title="Registrar" onPress={doSignup} />
    </View>
  );
}
