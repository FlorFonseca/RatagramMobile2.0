import React from "react";
import { TouchableOpacity, Image, StyleSheet, View, Text } from "react-native";

const ProfilePublicacion = ({ photo, description, likes, comments, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        source={{ uri: `http://192.168.1.25:3001/${photo}` }}
        style={styles.image}
      />
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
    overflow: "hidden",
    backgroundColor: "#f9f9f9",
  },
  image: {
    width: "100%",
    height: 200,
  },
  infoContainer: {
    padding: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
    color: "#333",
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stat: {
    fontSize: 12,
    color: "#777",
  },
});

export default ProfilePublicacion;

