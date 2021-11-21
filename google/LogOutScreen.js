import React, { Component } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import firebase from "firebase";
import Profile from "../screens/Profile";

export default class Logout extends Component {
  logout = (status) => {
    if (status === true) {
      firebase.auth().signOut();
    } else {
      this.props.navigation.navigate("Home");
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.buttonContainer2}>
          <Button
            title="Logout"
            color="red"
            onPress={(a) => this.logout(true)}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Back" onPress={(a) => this.logout(false)} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    width: "100%",
  },
  buttonContainer2: {
    width: "100%",
    marginBottom: 30,
  },
});
