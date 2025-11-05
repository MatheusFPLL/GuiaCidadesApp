// services/geonames.js
import axios from "axios";

// Substitua pelo seu username do GeoNames (exato)
const USERNAME = "mathfpl";

export const buscarCidades = async (query) => {
  if (!query) return [];
  try {
    const response = await axios.get("http://api.geonames.org/searchJSON", {
      params: {
        q: query,
        maxRows: 10,
        featureClass: "P",
        username: USERNAME,
      },
    });

    return (response.data.geonames || []).map((cidade) => ({
      id: cidade.geonameId,
      nome: cidade.name,
      display: `${cidade.name}, ${cidade.countryName}`,
      pais: cidade.countryName,
      populacao: cidade.population,
      latitude: cidade.lat,
      longitude: cidade.lng,
    }));
  } catch (error) {
    console.error("Erro ao buscar cidades:", error);
    return [];
  }
};

export const getCityById = async (geonameId) => {
  if (!geonameId) return null;
  try {
    const response = await axios.get("http://api.geonames.org/getJSON", {
      params: {
        geonameId,
        username: USERNAME,
      },
    });

    const d = response.data;
    if (!d || d.status) {
      console.warn("GeoNames get retornou erro/dados inválidos:", d);
      return null;
    }

    return {
      id: d.geonameId,
      nome: d.name,
      pais: d.countryName,
      populacao: d.population,
      latitude: d.lat,
      longitude: d.lng,
      timezone: d.timezone ? d.timezone.timeZoneId || d.timezone : null,
      raw: d,
    };
  } catch (error) {
    console.error("Erro ao obter detalhes da cidade:", error);
    return null;
  }
};
