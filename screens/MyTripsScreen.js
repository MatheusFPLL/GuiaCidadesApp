// screens/MyTripsScreen.js
import React, { useEffect, useState } from "react";
import { View, FlatList, Text, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { listFavorites, deleteFavorite } from "../services/api";
import CityCard from "../components/CityCard";

export default function MyTripsScreen({ navigation }) {
  const [token, setToken] = useState(null);
  const [favs, setFavs] = useState([]);

  useEffect(()=> {
    AsyncStorage.getItem('token').then(t => { setToken(t); if (t) load(t); });
  }, []);

  async function load(t) {
    const res = await listFavorites(t);
    setFavs(Array.isArray(res) ? res : []);
  }

  async function removeFav(id) {
    await deleteFavorite(token, id);
    load(token);
  }

  if (!token) return (
    <View style={{ padding:16 }}>
      <Text>Faça login para ver suas viagens</Text>
      <Button title="Ir para Login" onPress={() => navigation.navigate('Login')} />
    </View>
  );

  return (
    <FlatList
      data={favs}
      keyExtractor={(i)=>i._id || i.id}
      renderItem={({item}) => (
        <View style={{ margin:8 }}>
          <CityCard city={{ name: item.cityName, countryName: item.country }} onPress={() => navigation.navigate('CityDetails', { city: { name: item.cityName, countryName: item.country } })} />
          <Button title="Remover" onPress={() => removeFav(item._id)} />
        </View>
      )}
    />
  );
}
