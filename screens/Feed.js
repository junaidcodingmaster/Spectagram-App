import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  RefreshControl,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import PostCard from "./PostCard";

import { FlatList } from "react-native-gesture-handler";

import firebase from "firebase";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";

const fonts = {
  SpectagramLogoFonts: require("../assets/fonts/logoFont.ttf"),
  AllFonts: require("../assets/fonts/Roboto.ttf"),
};

export default class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lightTheme: false,
      fontsLoaded: false,
      posts: [],
      refreshing: false,
    };
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    fetchData().then(() => {
      this.setState({ refreshing: false });
    });
  };

  fetchPosts = () => {
    firebase
      .database()
      .ref("/posts/")
      .on(
        "value",
        (snapshot) => {
          let posts = [];
          if (snapshot.val()) {
            Object.keys(snapshot.val()).forEach(function (key) {
              posts.push({
                key: key,
                value: snapshot.val()[key],
              });
            });
          }
          this.setState({ posts: posts });
        },
        function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        }
      );
  };

  async _loadFontsAsync() {
    await Font.loadAsync(fonts);
    this.setState({ fontsLoaded: true });
  }

  fetchUser = () => {
    let theme;
    firebase
      .database()
      .ref("/users/" + firebase.auth().currentUser.uid)
      .on("value", (snapshot) => {
        theme = snapshot.val().current_theme;
        this.setState({ lightTheme: theme === "light" ? true : false });
      });
  };

  componentDidMount() {
    this.fetchPosts();
    this.fetchUser();
    this._loadFontsAsync();
  }
  _onRefresh = async () => {
    this.setState({ refreshing: true });
    setTimeout(() => {
      this.setState({ refreshing: false });
    }, 2000);
  };

  renderItem = ({ item: post }) => {
    return <PostCard post={post} navigation={this.props.navigation} />;
  };

  keyExtractor = (item, index) => index.toString();

  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      return (
        <View
          style={
            this.state.lightTheme ? styles.lightContainer : styles.container
          }
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
                    ? styles.lightAppTitleText
                    : styles.appTitleText
                }
              >
                Spectagram
              </Text>
            </View>
          </View>
          {!this.state.posts[0] ? (
            <View style={styles.noPosts}>
              <Text
                style={
                  this.state.lightTheme
                    ? styles.lightNoPostsText
                    : styles.noPostsText
                }
              >
                No Posts Available
              </Text>
            </View>
          ) : (
            <View style={styles.cardContainer}>
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.posts}
                renderItem={this.renderItem}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                  />
                }
              />
            </View>
          )}
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  // default Dark Theme

  container: {
    flex: 1,
    backgroundColor: "black",
  },
  droidSafeArea: {
    marginTop:
      Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35),
  },
  appTitle: {
    flex: 0.07,
    flexDirection: "row",
    alignContent: "center",
  },
  appIcon: {
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center",
  },
  iconImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  appTitleTextContainer: {
    flex: 0.8,
    justifyContent: "center",
  },
  appTitleText: {
    color: "white",
    fontSize: RFValue(28),
    fontFamily: "SpectagramLogoFonts",
  },
  cardContainer: {
    flex: 0.85,
  },
  noPosts: {
    flex: 0.85,
    justifyContent: "center",
    alignItems: "center",
  },
  noPostsText: {
    color: "white",
    fontSize: RFValue(20),
  },

  // Light Theme

  lightContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  lightAppTitleText: {
    color: "black",
    fontSize: RFValue(28),
    fontFamily: "SpectagramLogoFonts",
  },
  lightNoPostsText: {
    fontSize: RFValue(20),
  },
});
