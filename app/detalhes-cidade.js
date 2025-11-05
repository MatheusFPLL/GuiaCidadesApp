// app/detalhes-cidade.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  Pressable,
  Linking,
  Platform,
  Alert,
} from "react-native";
import { getCityById } from "../services/geonames";

/**
 * Tela de detalhes com layout mobile-friendly.
 * Exibe: nome, país, admin (estado/região), população, lat/lng, timezone,
 * imagem estática do local (OpenStreetMap staticmap), link para mapa e wikipedia (se disponível).
 */
export default function DetalhesCidade({ searchParams }) {
  const [cidade, setCidade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const resolveId = () => {
    if (searchParams && searchParams.id) return searchParams.id;
    // fallback: se searchParams tiver chaves diferentes
    if (searchParams && typeof searchParams === "object") {
      const keys = Object.keys(searchParams);
      for (const k of keys) {
        if (k.toLowerCase().includes("id") && searchParams[k]) return searchParams[k];
      }
    }
    // web fallback: window.location
    try {
      if (typeof window !== "undefined" && window.location && window.location.search) {
        const url = new URL(window.location.href);
        const idFromUrl = url.searchParams.get("id");
        if (idFromUrl) return idFromUrl;
      }
    } catch (e) {
      // ignore
    }
    return null;
  };

  useEffect(() => {
    const load = async () => {
      const id = resolveId();
      if (!id) {
        setError("ID da cidade não informado.");
        setLoading(false);
        return;
      }
      setLoading(true);
      const data = await getCityById(id);
      if (!data) {
        setError("Não foi possível obter detalhes da cidade.");
      } else {
        setCidade(data);
      }
      setLoading(false);
    };
    load();
  }, [searchParams]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Carregando detalhes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#c00" }}>{error}</Text>
      </View>
    );
  }

  if (!cidade) {
    return (
      <View style={styles.center}>
        <Text>Nenhuma informação disponível.</Text>
      </View>
    );
  }

  // displayName: se a rota enviou display (amigável), usa ela; senão usa cidade.nome
  const displayName = (searchParams && searchParams.display)
    ? decodeURIComponent(searchParams.display)
    : cidade.nome;

  // constroi URL do static map do OpenStreetMap (sem necessidade de API key)
  const lat = cidade.latitude;
  const lon = cidade.longitude;
  // tamanho da imagem: use largura "600x300", o RN irá dimensionar; evita pedir muitas requisições
  const staticMapUrl = lat && lon
    ? `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lon}&zoom=10&size=800x400&markers=${lat},${lon},red-pushpin`
    : null;

  // Abre mapa no app de mapas (Google Maps / Apple Maps)
  const openInMaps = async () => {
    if (!lat || !lon) {
      Alert.alert("Erro", "Coordenadas não disponíveis.");
      return;
    }
    const latlng = `${lat},${lon}`;
    const label = encodeURIComponent(displayName);

    // URLs para Google Maps e Apple Maps
    const google = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}&query_place_id=`;
    const apple = `http://maps.apple.com/?ll=${lat},${lon}&q=${label}`;

    const url = Platform.OS === "ios" ? apple : google;

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        // fallback abrir OpenStreetMap web
        const osm = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=12/${lat}/${lon}`;
        await Linking.openURL(osm);
      }
    } catch (err) {
      Alert.alert("Erro", "Não foi possível abrir o aplicativo de mapas.");
      console.warn("openInMaps erro:", err);
    }
  };

  // Abre Wikipedia se houver
  const openWikipedia = async () => {
    const raw = cidade.raw || {};
    const wiki = raw.wikipediaURL || raw.wikipedia || null;
    if (!wiki) {
      Alert.alert("Info", "Nenhuma página da Wikipedia disponível para esta cidade.");
      return;
    }
    // normaliza para conter protocolo
    const wikiUrl = wiki.startsWith("http") ? wiki : `https://${wiki}`;
    try {
      await Linking.openURL(wikiUrl);
    } catch (err) {
      Alert.alert("Erro", "Não foi possível abrir a Wikipedia.");
    }
  };

  // Info extra (admin/região, fcodeName, toponymName, alternatenames)
  const admin = cidade.raw?.adminName1 || cidade.raw?.adminCodes1 || null;
  const fcode = cidade.raw?.fcodeName || cidade.raw?.fcode || null;
  const wikiHint = cidade.raw?.wikipediaURL || cidade.raw?.wikipedia;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{displayName}</Text>

      {staticMapUrl ? (
        <Image
          source={{ uri: staticMapUrl }}
          style={styles.map}
          resizeMode="cover"
        />
      ) : null}

      <View style={styles.actionsRow}>
        <Pressable style={styles.actionButton} onPress={openInMaps}>
          <Text style={styles.actionText}>Abrir no Maps</Text>
        </Pressable>

        <Pressable
          style={[styles.actionButton, wikiHint ? {} : styles.actionButtonDisabled]}
          onPress={openWikipedia}
          disabled={!wikiHint}
        >
          <Text style={styles.actionText}>{wikiHint ? "Ver na Wikipedia" : "Sem Wikipedia"}</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <InfoRow label="País" value={cidade.pais || "-"} />
        <InfoRow label="Região / Estado" value={admin || "-"} />
        <InfoRow label="Tipo" value={fcode || "-"} />
        <InfoRow label="População" value={cidade.populacao ? Number(cidade.populacao).toLocaleString() : "-"} />
        <InfoRow label="Latitude" value={cidade.latitude || "-"} />
        <InfoRow label="Longitude" value={cidade.longitude || "-"} />
        <InfoRow label="Timezone" value={cidade.timezone || "-"} />
        <InfoRow label="Geoname ID" value={cidade.id ? String(cidade.id) : "-"} />
      </View>

      {/* Mostra raw (opcional) */}
      {cidade.raw ? (
        <View style={[styles.card, { marginTop: 12 }]}>
          <Text style={styles.rawTitle}>Dados brutos (GeoNames)</Text>
          <Text style={styles.rawText}>{JSON.stringify(cidade.raw, null, 2)}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

/** componente auxiliar para linhas de label/value */
function InfoRow({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    paddingBottom: 40,
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    color: "#c79f06",
    marginVertical: 12,
  },
  map: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    backgroundColor: "#eee",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 6,
    marginVertical: 8,
    paddingVertical: 10,
    backgroundColor: "#2a9df4",
    borderRadius: 8,
    alignItems: "center",
  },
  actionButtonDisabled: {
    backgroundColor: "#aaa",
  },
  actionText: {
    color: "#fff",
    fontWeight: "700",
  },
  card: {
    marginTop: 10,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    // subtle shadow for iOS
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    // elevation for Android
    elevation: 1,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
  },
  label: {
    fontWeight: "700",
    color: "#333",
  },
  value: {
    color: "#333",
    maxWidth: "65%",
    textAlign: "right",
  },
  rawTitle: {
    fontWeight: "700",
    marginBottom: 8,
  },
  rawText: {
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    fontSize: 11,
    color: "#444",
  },
});
