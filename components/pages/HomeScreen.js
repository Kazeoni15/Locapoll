import React, { useEffect, useState } from "react";
import { View, SafeAreaView, StyleSheet, Platform, Image, ScrollView } from "react-native";
import {
  Text,
  Button,
  IconButton,
  Searchbar,
  Drawer,
} from "react-native-paper";


import { useCollection, useDocument } from "react-firebase-hooks/firestore";

import { doc, getDoc, collection, query, where } from "firebase/firestore";
import { app, db } from "../../firebase-config";
import * as Location from "expo-location";
import { getAuth, signOut } from "firebase/auth";


import Navbar from "../nav/Navbar";
import ListLocation from "../list/ListLocation";

export default function HomeScreen({ navigation, userID }) {
  //   console.log("HomeScreen",userID)
  const auth = getAuth(app);
  //   console.log(auth)
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [userData, loading, error] = useDocument(doc(db, "users", userID), {
    snapshotListenOptions: { includeMetadataChanges: false },
  });
  



  
  const onChangeSearch = (query) => setSearchQuery(query);

  const onSearch = () => {
    console.log(searchQuery);
  };

  



  useEffect(() => {
    const fetchData = async () => {
      try {
        // Request permission to access location
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }

        // Get the user's current location
        const location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [userData]);

  return (
    <SafeAreaView style={styles.droidSafeArea}>
      {userData && (
        <View style={styles.page}>
          <Navbar navigation={navigation} userData={userData.data()}/>
          
          <View style={styles.body}>
            <View style={styles.operations}>
              <Text style={styles.title}>Polls in Vicinity</Text>
              <Button
                style={{ marginRight: 10 }}
                onPress={() => navigation.navigate('create-poll')}
                buttonColor="#D2DE32"
                mode="contained"
                icon={"plus"}
                textColor="#313866"
              >
                Create
              </Button>
            </View>

            <Searchbar
              style={styles.searchbar}
              onChangeText={onChangeSearch}
              placeholder="Search"
              onSubmitEditing={onSearch}
              onIconPress={onSearch}
            />

            <ScrollView style={styles.items}>
            {location?.coords ? (
              <ListLocation location={location} navigation={navigation}/>
            ) : (
              <Text>Loading location...</Text>
            )} 

            </ScrollView>
        
          </View>
        </View>
      )}

      {loading && <Text>Loading...</Text>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  droidSafeArea: {
    flex: 1,
    backgroundColor: "#D2DE32",
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
  page: {
    backgroundColor: "#313866",
    marginTop: 5,
    flex: 1,
    borderRadius: 10,
    // padding: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between", // This will align text and icon on opposite sides
    alignItems: "center",
  },
  headerel1: {
    flexDirection: "row",
    gap: 10,
    paddingTop: 25,
    paddingLeft: 15,

    // alignItems: "center", // This will vertically center the text and icon
  },
  headText: {
    fontSize: 20,
    fontWeight: 800,
    color: "white",
    paddingTop: 5,
  },
  body: {
    // display: "flex",
    backgroundColor: "white",
    alignItems: "center",
    paddingTop: 20,
    borderRadius: 25,
    zIndex:0,
   

    width: "100%",
  },
  searchbar: {
    width: "95%",
    marginTop: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 800,
    color: "#313866",
  },
  operations: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    // backgroundColor:'red',
    alignItems: "center",
    paddingLeft: 15,
  },
  items:{
    
    paddingTop:20
  }
});
