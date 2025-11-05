import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { buscarCidades } from "../services/geonames";

export default function ExploreScreen({ navigation }) {
  const [busca, setBusca] = useState("");
  const [cidades, setCidades] = useState([]);
  const [carregando, setCarregando] = useState(false);

  // buscar cidades quando o usuário parar de digitar
  useEffect(() => {
    const delay = setTimeout(() => {
      if (busca.length > 1) carregarCidades(busca);
      else setCidades([]);
    }, 600); // 600ms de debounce
    return () => clearTimeout(delay);
  }, [busca]);

  const carregarCidades = async (query) => {
    setCarregando(true);
    const resultados = await buscarCidades(query);
    setCidades(resultados);
    setCarregando(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌍 Explorar Cidades</Text>

      <TextInput
        style={styles.input}
        placeholder="Buscar cidade ou país..."
        value={busca}
        onChangeText={setBusca}
        returnKeyType="search"
        onSubmitEditing={Keyboard.dismiss}
      />

      {carregando && <ActivityIndicator size="large" color="#c7a008" />}

      <FlatList
        data={cidades}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("CityDetails", { cidade: item })}
          >
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.detalhes}>
              País: {item.pais || "—"}{"\n"}População:{" "}
              {item.populacao?.toLocaleString("pt-BR") || "Desconhecida"}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !carregando && busca.length > 1 ? (
            <Text style={styles.vazio}>Nenhuma cidade encontrada.</Text>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 50 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#c7a008",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  nome: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  detalhes: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
  vazio: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
});
