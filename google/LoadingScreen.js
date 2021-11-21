import React, { Component } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import firebase from "firebase";

export default class LoadingScreen extends Component {
  constructor() {
    super();
    this.state = {
      loadingText: "Loading ...",
    };
  }
  componentDidMount() {
    this.checkIfLoggedIn();
  }

  checkIfLoggedIn = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.props.navigation.navigate("DashboardScreen");
      } else {
        this.props.navigation.navigate("LoginScreen");
      }
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="blue" />
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
  loading: {
    width: 100,
    height: 100,
  },
  loadingText: {
    fontSize: 20,
    marginTop: 10,
    marginLeft: 20,
  },
});
