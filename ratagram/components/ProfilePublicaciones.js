import React from "react";
import { TouchableOpacity, Image, StyleSheet, View, Text } from "react-native";

const ProfilePublicacion = ({ photo, description, likes, comments }) => {
  return (
    <TouchableOpacity style={styles.container}>
      <Image source={{ uri: photo }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.stats}>
          <Text style={styles.stat}>{likes} ❤️</Text>
          <Text style={styles.stat}>{comments} 💬</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
  },
  image: { width: "100%", height: 200 },
  infoContainer: { padding: 8 },
  description: { fontSize: 14, marginBottom: 8, color: "#333" },
  stats: { flexDirection: "row", justifyContent: "space-between" },
  stat: { fontSize: 12, color: "#777" },
});

export default ProfilePublicacion;