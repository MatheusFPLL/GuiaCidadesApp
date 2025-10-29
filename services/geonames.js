import axios from "axios";

const username = "Mathfpl"; // coloque seu username do GeoNames

export const getCityById = async (cityId) => {
  try {
    const response = await axios.get(
      `http://api.geonames.org/getJSON?geonameId=${cityId}&username=${username}`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar cidade:", error);
    return null;
  }
};

export const searchCities = async (query) => {
  try {
    const response = await axios.get(
      `http://api.geonames.org/searchJSON?q=${query}&maxRows=10&username=${username}`
    );
    return response.data.geonames || [];
  } catch (error) {
    console.error("Erro ao buscar cidades:", error);
    return [];
  }
};
