// screens/ExploreScreen.js
import React, { useEffect, useState } from "react";
import { SafeAreaView, View, TextInput, FlatList, ActivityIndicator } from "react-native";
import CityCard from "../components/CityCard";
import axios from "axios";

const GEONAMES_USERNAME = "SEU_GEONAMES_USERNAME"; // substitua

async function searchCities(q) {
  const url = `http://api.geonames.org/searchJSON?q=${encodeURIComponent(q)}&maxRows=30&username=${GEONAMES_USERNAME}&featureClass=P`;
  const res = await axios.get(url);
  return res.data.geonames || [];
}

export default function ExploreScreen({ navigation }) {
  const [query, setQuery] = useState("Rio de Janeiro");
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  async function doSearch(q) {
    setLoading(true);
    try {
      const res = await searchCities(q);
      setCities(res);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  useEffect(() => { doSearch(query); }, []);

  return (
    <SafeAreaView style={{ flex:1 }}>
      <View style={{ padding:12 }}>
        <TextInput placeholder="Pesquisar cidade ou país..." value={query} onChangeText={setQuery}
          onSubmitEditing={() => doSearch(query)} style={{ padding:12, backgroundColor:'#fff', borderRadius:8 }} />
      </View>

      {loading ? <ActivityIndicator size="large" /> :
        <FlatList
          data={cities}
          keyExtractor={(i)=>String(i.geonameId)}
          renderItem={({item}) => (
            <CityCard city={{name:item.name, countryName:item.countryName, population:item.population, geonameId:item.geonameId}}
              onPress={(city) => navigation.navigate('CityDetails', { city })} />
          )}
        />
      }
    </SafeAreaView>
  );
}
