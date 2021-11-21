import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  ScrollView,
  TextInput,
  Button,
  Alert,
  ToastAndroid,
} from "react-native";

import { RFValue } from "react-native-responsive-fontsize";
import DropDownPicker from "react-native-dropdown-picker";

import firebase from "firebase";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";

import Toast, { DURATION } from "react-native-easy-toast";

const fonts = {
  SpectagramLogoFonts: require("../assets/fonts/logoFont.ttf"),
  AllFonts: require("../assets/fonts/Roboto.ttf"),
};

let preview_images = {
  image_1: { uri: "https://i.ibb.co/BG4r4y9/image-1.jpg" },
  image_2: { uri: "https://i.ibb.co/jMgHdzr/image-2.jpg" },
  image_3: { uri: "https://i.ibb.co/mT0CSk4/image-3.jpg" },
  image_4: { uri: "https://i.ibb.co/rcLMs8w/image-4.jpg" },
  image_5: { uri: "https://i.ibb.co/1nPQ1gL/image-5.jpg" },
  image_6: { uri: "https://i.ibb.co/rb5dVWN/image-6.jpg" },
  image_7: { uri: "https://i.ibb.co/fvbZ56L/image-7.jpg" },
};

export default class CreatePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewImage: "image_1",
      dropdownHeight: 40,
      lightTheme: false,
      fontsLoaded: false,
      name: "",
      profile_image: "",
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(fonts);
    this.setState({ fontsLoaded: true });
  }

  fetchUser = () => {
    let theme, image;
    firebase
      .database()
      .ref("/users/" + firebase.auth().currentUser.uid)
      .on("value", (snapshot) => {
        theme = snapshot.val().current_theme;
        image = snapshot.val().profile_picture;
        this.setState({
          lightTheme: theme === "light" ? true : false,
          profile_image: image,
        });
      });
  };

  async addPost() {
    if (this.state.caption) {
      const imgUrlFromLy = preview_images[this.state.previewImage].uri;
      let postData = {
        postImg: imgUrlFromLy.toString(),
        author: firebase.auth().currentUser.displayName,
        caption: this.state.caption,
        profile: this.state.profile_image,
        created_on: new Date().toString(),
        likes: 0,
        author_uid: firebase.auth().currentUser.uid,
      };
      await firebase
        .database()
        .ref("/posts/" + Math.random().toString(36).slice(2))
        .set(postData)
        .finally((end) =>
          this.toast.show("Your post has been successfully posted", 500, () => {
            this.props.navigation.navigate("Feed");
          })
        );
    } else {
      Alert.alert(
        "Error",
        "All fields are required!",
        [{ text: "OK", onPress: () => this.setState({ caption: "" }) }],
        { cancelable: false }
      );
    }
  }

  componentDidMount() {
    this.fetchUser();
    this._loadFontsAsync();

  }

  render() {
    return (
      <View
        style={this.state.lightTheme ? styles.containerLight : styles.container}
      >
        <SafeAreaView style={styles.droidSafeArea} />
        <View style={styles.appTitle}>
          <View style={styles.appIcon}>
            <Image
              source={require("../assets/logo.png")}
              style={styles.iconImage}
            ></Image>
          </View>
          <View style={styles.appTitleTextContainer}>
            <Text
              style={
                this.state.lightTheme
                  ? styles.appTitleTextLight
                  : styles.appTitleText
              }
            >
              New Post
            </Text>
          </View>
        </View>
        <View style={styles.fieldsContainer}>
          <ScrollView>
            <Image
              source={preview_images[this.state.previewImage]}
              style={styles.previewImage}
            ></Image>
            <View style={{ height: RFValue(this.state.dropdownHeight) }}>
              <DropDownPicker
                items={[
                  { label: "Image 1", value: "image_1" },
                  { label: "Image 2", value: "image_2" },
                  { label: "Image 3", value: "image_3" },
                  { label: "Image 4", value: "image_4" },
                  { label: "Image 5", value: "image_5" },
                  { label: "Image 6", value: "image_6" },
                  { label: "Image 7", value: "image_7" },
                ]}
                defaultValue={this.state.previewImage}
                containerStyle={{
                  height: 40,
                  borderRadius: 20,
                  marginBottom: 10,
                }}
                onOpen={() => {
                  this.setState({ dropdownHeight: 170 });
                }}
                onClose={() => {
                  this.setState({ dropdownHeight: 40 });
                }}
                style={{ backgroundColor: "transparent" }}
                itemStyle={{
                  justifyContent: "flex-start",
                }}
                dropDownStyle={{
                  backgroundColor: this.state.light_theme ? "#eee" : "#2a2a2a",
                }}
                labelStyle={{
                  color: this.state.light_theme ? "black" : "white",
                }}
                arrowStyle={{
                  color: this.state.light_theme ? "black" : "white",
                }}
                onChangeItem={(item) =>
                  this.setState({
                    previewImage: item.value,
                  })
                }
              />
            </View>

            <TextInput
              style={
                this.state.lightTheme ? styles.inputFontLight : styles.inputFont
              }
              onChangeText={(caption) => this.setState({ caption })}
              placeholder={"Caption"}
              placeholderTextColor={this.state.lightTheme ? "black" : "white"}
            />

            <View style={styles.submitButton}>
              <Button
                title="Submit"
                color="#841584"
                onPress={() => this.addPost()}
              />
            </View>

            <Toast
              ref={(toast) => (this.toast = toast)}
              style={{
                backgroundColor: this.state.lightTheme ? "black" : "white",
              }}
              position="center"
              positionValue={-200}
              fadeInDuration={750}
              fadeOutDuration={2000}
              opacity={0.8}
              textStyle={{ color: this.state.lightTheme ? "white" : "black" }}
            />
          </ScrollView>
        </View>
        <View style={{ flex: 0.08 }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  containerLight: {
    flex: 1,
    backgroundColor: "white",
  },
  droidSafeArea: {
    marginTop:
      Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35),
  },
  appTitle: {
    flex: 0.07,
    flexDirection: "row",
  },
  appIcon: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  iconImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: "center",
  },
  appTitleText: {
    color: "white",
    fontSize: 38,
    fontFamily: "SpectagramLogoFonts",
    textAlign: "justify",
  },
  appTitleTextLight: {
    color: "black",
    fontSize: 28,
    paddingLeft: 20,
  },
  fieldsContainer: {
    flex: 0.85,
  },
  previewImage: {
    width: "93%",
    height: RFValue(250),
    alignSelf: "center",
    borderRadius: RFValue(10),
    marginVertical: RFValue(10),
    resizeMode: "contain",
  },
  inputFont: {
    height: RFValue(40),
    borderColor: "white",
    borderWidth: RFValue(1),
    borderRadius: RFValue(10),
    paddingLeft: RFValue(10),
    color: "white",
    marginTop: 25,
  },
  inputFontLight: {
    height: 40,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    color: "black",
    marginTop: 25,
    fontFamily: "AllFonts",
  },
  submitButton: {
    marginTop: RFValue(20),
    alignItems: "center",
    justifyContent: "center",
  },
});
