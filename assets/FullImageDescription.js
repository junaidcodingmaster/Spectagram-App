import React from "react";
import { StyleSheet, View, Text } from "react-native";

export default class FullImageDescription extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{this.props.text}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    fontSize: 17,
    color: "white",
  }
});
