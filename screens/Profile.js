import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  Platform,
  StatusBar,
  Dimensions,
  Switch,
  ScrollView,
} from "react-native";
import firebase from "firebase";

import { RFValue } from "react-native-responsive-fontsize";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";

const fonts = {
  AllFonts: require("../assets/fonts/Roboto.ttf"),
};

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        profile_image: "",
        name: "",
        first_name: "",
        last_name: "",
        full_name: "",
        email: "",
      },
      isEnabled: false,
      light_theme: false,
    };
  }

  toggleSwitch() {
    const previous_state = this.state.isEnabled;
    const theme = !this.state.isEnabled ? "dark" : "light";
    var updates = {};
    updates["/users/" + firebase.auth().currentUser.uid + "/current_theme"] =
      theme;
    firebase.database().ref().update(updates);
    this.setState({ isEnabled: !previous_state, light_theme: previous_state });
  }

  _loadFontsAsync = async () => {
    await Font.loadAsync(fonts);
    this.setState({ fontsLoaded: true });
  };

  componentDidMount() {
    this._loadFontsAsync();
    this.fetchUser();
  }

  componentWillUnmount() {
    this.setState({
      user: {
        name: "",
        first_name: "",
        last_name: "",
        full_name: "",
        email: "",
      },
    });
  }

  async fetchUser() {
    let theme, name, image, full_name, first_name, last_name, email;
    await firebase
      .database()
      .ref("/users/" + firebase.auth().currentUser.uid)
      .on("value", function (snapshot) {
        theme = snapshot.val().current_theme;
        image = snapshot.val().profile_picture;
        full_name = `${snapshot.val().first_name} ${snapshot.val().last_name}`;
        first_name = snapshot.val().first_name;
        last_name = snapshot.val().last_name;
        email = snapshot.val().gmail;
        name = snapshot.val().first_name;
      });

    this.setState({
      user: {
        profile_image: image,
        full_name: full_name,
        first_name: first_name,
        last_name: last_name,
        name: name,
        email: email,
      },
      light_theme: theme === "light" ? true : false, 
      isEnabled: theme === "light" ? false : true,
    });
  }

  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      return (
        <View
          style={
            this.state.light_theme ? styles.lightContainer : styles.container
          }
        >
          <SafeAreaView style={styles.droidSafeArea} />
          <ScrollView>
            <View>
              <View style={styles.profileBackgroundContainer}>
                <Image
                  source={require("../assets/spectagram_profile_background.png")}
                  style={styles.profileBackground}
                />
              </View>
              <View style={styles.profileImageContainer}>
                <Image
                  source={{ uri: this.state.user.profile_image }}
                  style={styles.profileImage}
                />
              </View>
              <View style={styles.userNameContainer}>
                <Text style={styles.userNameText}>{this.state.user.name}</Text>
              </View>
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.nameContainer}>
                <Text
                  style={
                    this.state.light_theme
                      ? styles.lightNameTitle
                      : styles.nameTitle
                  }
                >
                  Name :
                </Text>
                <Text
                  style={
                    this.state.light_theme
                      ? styles.lightNameText
                      : styles.nameText
                  }
                >
                  {this.state.user.full_name}
                </Text>
              </View>
              <View style={styles.emailContainer}>
                <Text
                  style={
                    this.state.light_theme
                      ? styles.lightEmailTitle
                      : styles.emailTitle
                  }
                >
                  Email :
                </Text>
                <Text
                  style={
                    this.state.light_theme
                      ? styles.lightEmailText
                      : styles.emailText
                  }
                >
                  {this.state.user.email}
                </Text>
              </View>
              <View style={styles.firstNameContainer}>
                <Text
                  style={
                    this.state.light_theme
                      ? styles.lightFirstNameTitle
                      : styles.firstNameTitle
                  }
                >
                  First Name :
                </Text>
                <Text
                  style={
                    this.state.light_theme
                      ? styles.lightFirstNameText
                      : styles.firstNameText
                  }
                >
                  {this.state.user.first_name}
                </Text>
              </View>
              <View style={styles.lastNameContainer}>
                <Text
                  style={
                    this.state.light_theme
                      ? styles.lightLastNameTitle
                      : styles.lastNameTitle
                  }
                >
                  Last Name :
                </Text>
                <Text
                  style={
                    this.state.light_theme
                      ? styles.lightLastNameText
                      : styles.lastNameText
                  }
                >
                  {this.state.user.last_name}
                </Text>
              </View>
            </View>
            <View style={styles.themeContainer}>
              <Text
                style={
                  this.state.light_theme
                    ? styles.lightThemeText
                    : styles.themeText
                }
              >
                Dark Theme
              </Text>
              <Switch
                style={{ transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] }}
                trackColor={{
                  false: "#767577",
                  true: this.state.light_theme ? "#eee" : "white",
                }}
                thumbColor={this.state.isEnabled ? "#ee8249" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => this.toggleSwitch()}
                value={this.state.isEnabled}
              />
            </View>
            <View style={{ height: 100 }} />
          </ScrollView>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  // default dark theme

  container: {
    flex: 1,
    backgroundColor: "black",
  },
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  profileBackground: {
    height: 350,
    width: Dimensions.get("window").width,
  },
  profileImageContainer: {
    marginTop: -235,
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    width: 160,
    height: 160,
    borderRadius: 100,
    marginLeft: 15,
  },
  userNameContainer: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginLeft: 15,
    marginTop: 5,
  },
  userNameText: {
    color: "black",
    fontSize: 25,
    fontWeight: "bold",
    fontFamily: "AllFonts",
  },
  profileInfo: {
    marginTop: 40,
  },
  nameContainer: {
    marginLeft: 10,
  },
  nameTitle: {
    fontSize: 25,
    color: "white",
    fontFamily: "AllFonts",
  },
  nameText: {
    fontSize: 17,
    marginTop: 5,
    color: "white",
    fontFamily: "AllFonts",
  },
  emailContainer: {
    marginLeft: 10,
    marginTop: 15,
  },
  emailTitle: {
    fontSize: 25,
    color: "white",
    fontFamily: "AllFonts",
  },
  emailText: {
    fontSize: 17,
    marginTop: 5,
    color: "white",
    fontFamily: "AllFonts",
  },
  firstNameContainer: {
    marginLeft: 10,
    marginTop: 15,
  },
  firstNameTitle: {
    fontSize: 25,
    color: "white",
    fontFamily: "AllFonts",
  },
  firstNameText: {
    fontSize: 17,
    marginTop: 5,
    color: "white",
    fontFamily: "AllFonts",
  },
  lastNameContainer: {
    marginLeft: 10,
    marginTop: 15,
  },
  lastNameTitle: {
    fontSize: 25,
    color: "white",
    fontFamily: "AllFonts",
  },
  lastNameText: {
    fontSize: 17,
    marginTop: 5,
    color: "white",
    fontFamily: "AllFonts",
  },
  themeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  themeText: {
    color: "white",
    fontSize: RFValue(20),
    marginRight: RFValue(15),
    fontFamily: "AllFonts",
  },

  // Light Theme

  lightContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  lightNameTitle: {
    fontSize: 25,
    color: "black",
    fontFamily: "AllFonts",
  },
  lightNameText: {
    fontSize: 17,
    marginTop: 5,
    color: "black",
    fontFamily: "AllFonts",
  },
  lightEmailTitle: {
    fontSize: 25,
    color: "black",
    fontFamily: "AllFonts",
  },
  lightEmailText: {
    fontSize: 17,
    marginTop: 5,
    color: "black",
    fontFamily: "AllFonts",
  },
  lightFirstNameTitle: {
    fontSize: 25,
    color: "black",
    fontFamily: "AllFonts",
  },
  lightFirstNameText: {
    fontSize: 17,
    marginTop: 5,
    color: "black",
    fontFamily: "AllFonts",
  },
  lightLastNameTitle: {
    fontSize: 25,
    color: "black",
    fontFamily: "AllFonts",
  },
  lightLastNameText: {
    fontSize: 17,
    marginTop: 5,
    color: "black",
    fontFamily: "AllFonts",
  },
  lightThemeText: {
    color: "black",
    fontSize: RFValue(20),
    marginRight: RFValue(15),
    fontFamily: "AllFonts",
  },
});
