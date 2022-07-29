import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const Header = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>✨My Todo App✨</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 95,
    paddingTop: 50,
    backgroundColor: "#668aff",
  },
  title: {
    textAlign: "center",
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default Header;
