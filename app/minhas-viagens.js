import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import axios from "axios";
import Navbar from "../components/Navbar"; // ✅ caminho correto para sua estrutura

export default function MinhasViagens() {
  const [viagens, setViagens] = useState([
    {
      id: "1",
      nome: "Porto de Galinhas",
      data: "12/03/2023",
      imagem:
        "https://cdn.britannica.com/94/176894-050-F706D70A/Porto-de-Galinhas-Brazil.jpg",
    },
    {
      id: "2",
      nome: "Tóquio",
      data: "28/07/2024",
      imagem:
        "https://cdn.britannica.com/58/175958-050-03E1C657/Tokyo-Tower-Japan.jpg",
    },
    {
      id: "3",
      nome: "Dubai",
      data: "10/11/2022",
      imagem:
        "https://cdn.britannica.com/99/153599-050-31A3C76A/Dubai-city-United-Arab-Emirates.jpg",
    },
  ]);

  // 🔍 Busca informações adicionais da cidade via GeoNames
  const buscarCidade = async (cidade) => {
    try {
      const resp = await axios.get(
        `https://secure.geonames.org/searchJSON?q=${cidade}&maxRows=1&username=demo`
      );
      const dados = resp.data.geonames[0];
      if (dados) {
        Alert.alert(
          "Informações da cidade",
          `${dados.name}, ${dados.countryName}\nLatitude: ${dados.lat}\nLongitude: ${dados.lng}`
        );
      } else {
        Alert.alert("Cidade não encontrada");
      }
    } catch (error) {
      Alert.alert("Erro ao buscar cidade");
    }
  };

  const adicionarViagem = () => {
    Alert.alert("Adicionar Viagem", "Funcionalidade em desenvolvimento!");
  };

  const editarViagem = (nome) => {
    Alert.alert("Editar Viagem", `Editar informações de ${nome}`);
  };

  const excluirViagem = (id) => {
    Alert.alert("Excluir Viagem", "Deseja realmente excluir?", [
      { text: "Cancelar" },
      {
        text: "Excluir",
        onPress: () => setViagens(viagens.filter((v) => v.id !== id)),
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imagem }} style={styles.cardImage} />
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{item.nome}</Text>
        <Text style={styles.cardDate}>Visitado em: {item.data}</Text>
        <View style={styles.cardButtons}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => editarViagem(item.nome)}
          >
            <Text style={styles.btnText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => excluirViagem(item.id)}
          >
            <Text style={styles.btnText}>Excluir</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, styles.btnInfo]}
            onPress={() => buscarCidade(item.nome)}
          >
            <Text style={styles.btnText}>Info</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* ✅ Navbar sempre no topo */}
      <Navbar />

      <View style={styles.main}>
        <View style={styles.topSection}>
          <Text style={styles.title}>Minhas Viagens</Text>
          <TouchableOpacity style={styles.btnAdd} onPress={adicionarViagem}>
            <Text style={styles.btnAddText}>+ Adicionar Viagem</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={viagens}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.cardsContainer}
        />
      </View>

      {/* Rodapé fixo */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2025 Guia Cidades — Todos os direitos reservados.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  main: { flex: 1, padding: 20 },

  // TOPO
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    flexWrap: "wrap",
  },
  title: { fontSize: 22, color: "#c7a008", fontWeight: "600" },
  btnAdd: {
    backgroundColor: "#c7a008",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  btnAddText: { color: "#fff", fontWeight: "600" },

  // CARDS
  cardsContainer: { paddingBottom: 80 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 3,
  },
  cardImage: { width: "100%", height: 180 },
  cardInfo: { padding: 15 },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  cardDate: { color: "#777", marginTop: 4, marginBottom: 10 },
  cardButtons: { flexDirection: "row", justifyContent: "space-around" },
  btn: {
    backgroundColor: "#c7a008",
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  btnInfo: { backgroundColor: "#a4893d" },
  btnText: { color: "#fff", fontWeight: "500" },

  // FOOTER
  footer: {
    backgroundColor: "#222",
    alignItems: "center",
    paddingVertical: 10,
  },
  footerText: { color: "#fff", fontSize: 12 },
});
