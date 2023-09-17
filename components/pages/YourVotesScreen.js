import React, { useEffect, useState } from "react";
import { View, SafeAreaView, StyleSheet, Platform, Image } from "react-native";
import {
  Text,
  Button,
  IconButton,
  Searchbar,
  Drawer,
  ActivityIndicator,
} from "react-native-paper";

import { useDocument, useCollection } from "react-firebase-hooks/firestore";

import {
  doc,
  getDoc,
  collection,
  updateDoc,
  Timestamp,
  addDoc,
} from "firebase/firestore";
import { app, db } from "../../firebase-config";
import * as Location from "expo-location";
import { getAuth, signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity, ScrollView } from "react-native";
import FormTextInput from "../auth/FormTextInput";
import Navbar from "../nav/Navbar";
import DraftsItem from "../clickable/DraftsItem";

export default function YourVotesScreen({ navigation, userID }) {
  //   console.log("HomeScreen",userID)

  //   console.log(auth)
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [userData, loading, error] = useDocument(doc(db, "users", userID), {
    snapshotListenOptions: { includeMetadataChanges: false },
  });

  // console.log(value?.docs[0].data())

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadiusKm = 6371; // Radius of the Earth in kilometers

    // Convert latitude and longitude from degrees to radians
    const lat1Rad = toRadians(lat1);
    const lon1Rad = toRadians(lon1);
    const lat2Rad = toRadians(lat2);
    const lon2Rad = toRadians(lon2);

    // Calculate the differences between coordinates
    const latDiff = lat2Rad - lat1Rad;
    const lonDiff = lon2Rad - lon1Rad;

    // Calculate the Haversine distance
    const a =
      Math.sin(latDiff / 2) ** 2 +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(lonDiff / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = earthRadiusKm * c;

    return distanceKm;
  }

  function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  //   const distance = calculateDistance(location?.coords.latitude, location?.coords.longitude, 48.8566, 2.3522); // Berlin to Paris
  //   console.log(`Distance: ${distance} km`);

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
          <Navbar userData={userData.data()} navigation={navigation} />
          <View style={styles.body}>
            <View style={styles.operations}>
              <Text style={styles.title}>Your Votes</Text>
            </View>
            <ScrollView>
              <View style={{ paddingBottom: 200, paddingTop: 20, rowGap: 15 }}>
                {userData.data() &&
                  userData.data().votes.map((item, index) => {
                    console.log(item);
                    return (
                        <View key={index} style={styles.container}>
                        <View style={styles.item}>
                       <View style={{ width: "80%" }}>
                         <Text style={styles.question}>{item.question}</Text>
                         <Text style={styles.option}>  {item.votedFor}</Text>
                         
                         
                       </View>
                       <View>  
                        <IconButton icon={'arrow-right'} iconColor="#313866" onPress={()=>{navigation.navigate('poll', {pollID:item.pollId})}}/>
                       
                 
                       </View>
                       
                 
                       
                     </View>
                 
                 
                 
                     </View>
                    );
                  })}
              </View>
            </ScrollView>
          </View>
        </View>
      )}

      {loading && (
        <ActivityIndicator
          style={{ marginTop: "40%" }}
          size="large"
          color="#313866"
          animating={true}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  droidSafeArea: {
    flex: 1,
    backgroundColor: "#D2DE32",
    paddingTop: Platform.OS === "android" ? 18 : 0,
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
    display: "flex",
    backgroundColor: "white",
    alignItems: "center",
    paddingTop: 20,
    borderRadius: 25,

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
    paddingBottom: 15,
  },
  operations: {
    width: "100%",

    flexDirection: "row",
    justifyContent: "space-between",
    // backgroundColor:'red',
    alignItems: "center",
    paddingLeft: 15,
  },
  form: {
    rowGap: 15,
    width: "90%",
  },
  item: {
    marginTop: 5,
    flexDirection: "row",
    padding: 20,
    justifyContent: "space-between",
    columnGap: 5,
    // alignItems: "center",
    // width: "100%",
    
  },
  question: {
    color: "#313866",
    fontSize: 18,
    fontWeight: "bold",
    padding: 3,
  },
  option: {
    color: "#313866",
  },
  container:{
    backgroundColor: "#D2DE32",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#313866",
   
  }
});
