import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  Modal,
  StyleSheet,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function MinhasDicasScreen() {
  const router = useRouter();
  const [isLogged, setIsLogged] = useState(false);
  const [dicas, setDicas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [novaDica, setNovaDica] = useState({
    cidade: "",
    descricao: "",
    lugares: "",
    imagem: "",
  });

  // Verifica login ao abrir
  useEffect(() => {
    const checkLogin = async () => {
      const user = await AsyncStorage.getItem("userLogged");
      if (!user) {
        Alert.alert("Acesso restrito", "Faça login para ver e postar dicas.");
        router.push("/login");
      } else {
        setIsLogged(true);
        carregarDicas();
      }
    };
    checkLogin();
  }, []);

  const carregarDicas = async () => {
    const saved = await AsyncStorage.getItem("dicas");
    if (saved) setDicas(JSON.parse(saved));
  };

  const salvarDicas = async (newList) => {
    setDicas(newList);
    await AsyncStorage.setItem("dicas", JSON.stringify(newList));
  };

  const handleAddDica = () => {
    if (!novaDica.cidade || !novaDica.descricao) {
      Alert.alert("Campos obrigatórios", "Preencha todos os campos.");
      return;
    }

    const nova = {
      id: Date.now().toString(),
      cidade: novaDica.cidade,
      descricao: novaDica.descricao,
      lugares: novaDica.lugares.split(",").map((x) => x.trim()),
      imagem:
        novaDica.imagem ||
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    };

    const updated = [...dicas, nova];
    salvarDicas(updated);
    setNovaDica({ cidade: "", descricao: "", lugares: "", imagem: "" });
    setModalVisible(false);
  };

  const handleDelete = (id) => {
    Alert.alert("Excluir dica", "Tem certeza?", [
      { text: "Cancelar" },
      {
        text: "Excluir",
        onPress: () => {
          const filtered = dicas.filter((d) => d.id !== id);
          salvarDicas(filtered);
        },
      },
    ]);
  };

  const handleEdit = (dica) => {
    setNovaDica({
      cidade: dica.cidade,
      descricao: dica.descricao,
      lugares: dica.lugares.join(", "),
      imagem: dica.imagem,
      id: dica.id,
    });
    setModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (!novaDica.cidade || !novaDica.descricao) {
      Alert.alert("Campos obrigatórios", "Preencha todos os campos.");
      return;
    }

    const updated = dicas.map((d) =>
      d.id === novaDica.id
        ? {
            ...d,
            cidade: novaDica.cidade,
            descricao: novaDica.descricao,
            lugares: novaDica.lugares.split(",").map((x) => x.trim()),
            imagem: novaDica.imagem,
          }
        : d
    );
    salvarDicas(updated);
    setModalVisible(false);
    setNovaDica({ cidade: "", descricao: "", lugares: "", imagem: "" });
  };

  if (!isLogged) return null;

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Título e botão */}
        <View style={styles.topSection}>
          <Text style={styles.title}>Minhas Dicas de Viagem</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addText}>+ Adicionar Dica</Text>
          </TouchableOpacity>
        </View>

        {/* Cards */}
        <FlatList
          data={dicas}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.imagem }} style={styles.image} />
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{item.cidade}</Text>
                <Text style={styles.desc}>{item.descricao}</Text>
                {item.lugares && (
                  <View style={styles.lugaresList}>
                    {item.lugares.map((l, i) => (
                      <Text key={i} style={styles.lugarItem}>
                        • {l}
                      </Text>
                    ))}
                  </View>
                )}
                <View style={styles.cardButtons}>
                  <TouchableOpacity
                    style={[styles.btn, styles.btnEdit]}
                    onPress={() => handleEdit(item)}
                  >
                    <Text style={styles.btnText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btn, styles.btnDelete]}
                    onPress={() => handleDelete(item.id)}
                  >
                    <Text style={styles.btnText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      </ScrollView>

      {/* Modal Adicionar / Editar */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {novaDica.id ? "Editar Dica" : "Nova Dica"}
            </Text>
            <TextInput
              placeholder="Cidade"
              style={styles.input}
              value={novaDica.cidade}
              onChangeText={(t) => setNovaDica({ ...novaDica, cidade: t })}
            />
            <TextInput
              placeholder="Descrição"
              style={styles.input}
              value={novaDica.descricao}
              onChangeText={(t) => setNovaDica({ ...novaDica, descricao: t })}
            />
            <TextInput
              placeholder="Lugares (separados por vírgula)"
              style={styles.input}
              value={novaDica.lugares}
              onChangeText={(t) => setNovaDica({ ...novaDica, lugares: t })}
            />
            <TextInput
              placeholder="URL da imagem (opcional)"
              style={styles.input}
              value={novaDica.imagem}
              onChangeText={(t) => setNovaDica({ ...novaDica, imagem: t })}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.btn, styles.btnEdit]}
                onPress={novaDica.id ? handleSaveEdit : handleAddDica}
              >
                <Text style={styles.btnText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.btnDelete]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.btnText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", padding: 16 },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#c7a008",
  },
  addBtn: {
    backgroundColor: "#c7a008",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  addText: { color: "white", fontWeight: "600" },
  card: {
    backgroundColor: "white",
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  image: { width: "100%", height: 180 },
  cardInfo: { padding: 15 },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  desc: { color: "#555", marginVertical: 8 },
  lugaresList: { marginBottom: 10 },
  lugarItem: { color: "#444", fontSize: 13 },
  cardButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  btnEdit: { backgroundColor: "#ff9100" },
  btnDelete: { backgroundColor: "#c7a008" },
  btnText: { color: "white", fontWeight: "600" },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    width: "90%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#c7a008",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginVertical: 6,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
  },
});
