import firebase from "firebase";
import * as React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { firebaseConfig } from "./config";
import DashboardScreen from "./google/DashboardScreen";
import LoadingScreen from "./google/LoadingScreen";
import LoginScreen from "./google/LoginScreen";
// For preview
import Profile from "./screens/Profile";
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

const AppSwitchNavigator = createSwitchNavigator({
  LoadingScreen: LoadingScreen,
  LoginScreen: LoginScreen,
  DashboardScreen: DashboardScreen,
});

const AppNavigator = createAppContainer(AppSwitchNavigator);

export default class App extends React.Component {
  render() {
    return <AppNavigator />;
  }
}
