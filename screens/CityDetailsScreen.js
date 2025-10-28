// screens/CityDetailsScreen.js
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addFavorite } from "../services/api";
import * as ImagePicker from "expo-image-picker";
import { createTip } from "../services/api";
import axios from "axios";
import { getCityById } from "../services/geonames"; // opcional: you can implement as in earlier code

export default function CityDetailsScreen({ route, navigation }) {
  const { city } = route.params;
  const [token, setToken] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('token').then(t => setToken(t));
  }, []);

  async function saveFavorite() {
    if (!token) { navigation.navigate('Login'); return; }
    try {
      const res = await addFavorite(token, { cityName: city.name, country: city.countryName });
      if (res._id || res.id) Alert.alert('Favorito salvo');
      else Alert.alert('Erro', res.message || 'Erro ao salvar favorito');
    } catch (e) { Alert.alert('Erro', e.message); }
  }

  async function addTipWithPhoto() {
    if (!token) { navigation.navigate('Login'); return; }
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return Alert.alert('Permissão necessária');
    const result = await ImagePicker.launchImageLibraryAsync({ quality:0.6, allowsEditing:true });
    if (result.cancelled) return;
    const res = await createTip(token, { cityName: city.name, country: city.countryName, text: "Minhas dicas", photoUri: result.uri });
    if (res._id) Alert.alert('Dica criada');
    else Alert.alert('Erro', res.message || 'Erro ao criar dica');
  }

  return (
    <ScrollView style={{ padding:16 }}>
      <Text style={{ fontSize:24, fontWeight:'700' }}>{city.name}, {city.countryName}</Text>
      <Text style={{ marginTop:8 }}>População: {city.population || '—'}</Text>

      <View style={{ marginTop:12 }}>
        <Button title="Salvar nas Minhas Viagens" onPress={saveFavorite} />
      </View>

      <View style={{ marginTop:12 }}>
        <Button title="Adicionar Dica com Foto" onPress={addTipWithPhoto} />
      </View>
    </ScrollView>
  );
}
