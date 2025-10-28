// components/CityCard.js
import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

export default function CityCard({ city, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(city)}>
      <Text style={styles.title}>{city.name}, {city.countryName}</Text>
      <Text style={styles.subtitle}>População: {city.population || '—'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card:{ padding:14, margin:8, backgroundColor:'#fff', borderRadius:8, elevation:2 },
  title:{ fontSize:16, fontWeight:'700' },
  subtitle:{ marginTop:6, color:'#666' }
});
