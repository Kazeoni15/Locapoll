import React, { useEffect, useState } from "react";
import { View, SafeAreaView, StyleSheet, Platform, Image } from "react-native";
import {
  Text,
  Button,
  IconButton,
  Searchbar,
  Drawer,
  TextInput,
  HelperText,
} from "react-native-paper";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuth } from "../../hooks/useAuth";
import CreatePoll from "../../screens/CreatePoll";
import { useDocument } from "react-firebase-hooks/firestore";

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
import { FieldArray, Formik } from "formik";
import * as Yup from "yup";
import Navbar from "../nav/Navbar";

export default function CreatePollScreen({ navigation, userID }) {
  //   console.log("HomeScreen",userID)
  const auth = getAuth(app);
  //   console.log(auth)
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [userData, loading, error] = useDocument(doc(db, "users", userID), {
    snapshotListenOptions: { includeMetadataChanges: false },
  });

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
          {/* <View style={styles.header}>
            <View style={styles.headerel1}>
              {userData.data().avatar ? (
                <Image
                  source={{ uri: userData.data().avatar.url }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 100,
                    marginBottom: 20,
                  }}
                />
              ) : (
                <IconButton icon={"account-cricle-outline"} iconColor="white" />
              )}
              <Text style={styles.headText}>{userData.data().username}</Text>
            </View>

            <IconButton
              icon={"cog"}
              iconColor="white"
              onPress={() => {
                navigation.navigate("settings");
              }}
            />

            <IconButton
              icon={"logout"}
              iconColor="white"
              onPress={async () => {
                try {
                  // Clear the UID from AsyncStorage
                  await AsyncStorage.clear();

                  // Add any additional logout logic here (e.g., sign out from Firebase)
                  signOut(getAuth(app));
                  // Navigate to your sign-in screen or any other appropriate screen
                  // For example, if you're using React Navigation, you can navigate like this:
                  // navigation.navigate('SignIn');
                } catch (error) {
                  console.error("Error while logging out:", error);
                  // Handle any logout errors as needed
                }
              }}
            />
          </View> */}
          <Navbar userData={userData.data()} navigation={navigation}/>
          <View style={styles.body}>
            <Formik
              initialValues={{ question: "", options: ["", ""] }}
              validationSchema={Yup.object().shape({
                question: Yup.string().required("Question is required"),
                options: Yup.array()
                  .of(Yup.string().required("Option is required"))
                  .min(2, "Minimum of 2 options required"),
              })}
              onSubmit={async (values, actions) => {
                // Handle form submission, values will contain the question and options
                console.log("Form submitted:", values);

                await addDoc(collection(doc(db, "users", userID), "drafts"), {
                  question: values.question,
                  options: values.options,
                  created: Timestamp.now(),
                  votes: [],
                });

                navigation.navigate("drafts");
              }}
            >
              {({ values, handleChange, handleSubmit, errors }) => (
                <ScrollView style={styles.form}>
                  <View>
                    <Text style={styles.title}>Draft</Text>
                  </View>

                  <View style={{ paddingBottom: 10 }}>
                    <FormTextInput
                      label="Enter your question"
                      value={values.question}
                      onChangeText={handleChange("question")}
                      error={errors.question}
                      multiline
                    />
                  </View>
                  <FieldArray
                    name="options"
                    render={(arrayHelpers) => (
                      <View style={styles.form}>
                        {values.options.map((option, index) => (
                          <View key={index}>
                          

                            <View style={{ height: 75 }}>
                              <TextInput
                                label={`Option ${index + 1}`}
                                mode="flat"
                                value={option}
                                onChangeText={(text) =>
                                  arrayHelpers.replace(index, text)
                                }
                                right={
                                  <TextInput.Icon
                                    icon="minus"
                                    iconColor="red"
                                    onPress={() => {
                                      if (index <= 1) {
                                      } else {
                                        arrayHelpers.remove(index);
                                      }
                                    }}
                                  />
                                }
                                underlineColor={"#D2DE32"}
                                activeUnderlineColor={"#016A70"}
                                textColor={"#016A70"}
                              />
                              {errors && (
                                <HelperText type="error">
                                  {errors.options?.[index]}
                                </HelperText>
                              )}
                            </View>
                           
                          </View>
                        ))}
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingBottom: 200,
                          }}
                        >
                          <IconButton
                            onPress={() => arrayHelpers.push("")}
                            icon="plus"
                            iconColor="green"
                          />

                          <Button
                            onPress={handleSubmit}
                            icon="check"
                            mode="text"
                            textColor="#313866"
                          >
                            Save
                          </Button>
                        </View>
                      </View>
                    )}
                  />
                </ScrollView>
              )}
            </Formik>
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
});
