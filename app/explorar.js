// app/explorar.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Button,
} from "react-native";
import { buscarCidades } from "../services/geonames";
import { useRouter } from "expo-router";

export default function Explorar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    const q = query.trim();
    if (q.length < 3) {
      setResults([]);
      return;
    }
    setLoading(true);
    const data = await buscarCidades(q);
    setResults(data);
    setLoading(false);
  };

  const goToDetails = (item) => {
    // DEBUG: garanta que o item tem id
    console.log("[Explorar] item clicado:", item);

    // forma recomendada (objeto) — envia params
    const params = { id: String(item.id), display: item.display };
    console.log("[Explorar] enviando para /detalhes-cidade com params:", params);

    try {
      router.push({
        pathname: "/detalhes-cidade",
        params,
      });
    } catch (err) {
      // fallback para construir query manualmente
      const fallbackUrl = `/detalhes-cidade?id=${encodeURIComponent(params.id)}&display=${encodeURIComponent(params.display)}`;
      console.warn("[Explorar] router.push com objeto falhou, tentando fallback:", fallbackUrl, err);
      router.push(fallbackUrl);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explorar Destinos</Text>

      <TextInput
        style={styles.input}
        placeholder="Buscar cidade ou país..."
        value={query}
        onChangeText={setQuery}
        returnKeyType="search"
        onSubmitEditing={handleSearch}
      />

      <Button title="Buscar" onPress={handleSearch} />

      {loading && <Text style={{ textAlign: "center", marginVertical: 10 }}>Carregando...</Text>}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingTop: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => goToDetails(item)}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
              }}
              style={styles.image}
            />
            <View style={styles.info}>
              <Text style={styles.city}>{item.display}</Text>
              <Text style={styles.country}>{item.pais}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !loading && query.trim().length >= 3 ? (
            <Text style={{ textAlign: "center", marginTop: 20 }}>Nenhuma cidade encontrada</Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  title: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 20,
    color: "#c7a008",
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 15,
    marginBottom: 15,
    overflow: "hidden",
    elevation: 2,
  },
  image: { width: 100, height: 100 },
  info: { flex: 1, padding: 10, justifyContent: "center" },
  city: { fontWeight: "bold", fontSize: 16 },
  country: { color: "#666" },
});
