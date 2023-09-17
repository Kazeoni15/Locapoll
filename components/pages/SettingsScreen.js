import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  Platform,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Text, Button, IconButton, ActivityIndicator, Snackbar } from "react-native-paper";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuth } from "../../hooks/useAuth";
import { Formik } from "formik";
import * as Yup from "yup";
import FormTextInput from "../auth/FormTextInput";
import * as ImagePicker from "expo-image-picker";
import { storage, db } from "../../firebase-config";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import Navbar from "../nav/Navbar";

const Tab = createBottomTabNavigator();

const validationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  firstname: Yup.string().required("First name is required"),
  lastname: Yup.string().required("Last name is required"),
  age: Yup.number()
    .required("Age is required")
    .min(5, "Age must be at least 5"),
});

export default function SettingsScreen({ navigation, userID }) {
  
  const [image, setImage] = useState(null);
  const [snack, setSnack] = useState(false)

  const [userData, loading, error] = useDocument(doc(db, "users", userID), {
    snapshotListenOptions: { includeMetadataChanges: false },
  });

  
  // console.log(user, userData.data());

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  // console.log(user?.uid)
  // console.log("image",image)

  const handleUpload = () => {
    if (image.type === "image") {
      if(userData.data().avatar){

        const delRef = ref(storage, userData.data().avatar.location)
        deleteObject(delRef).then(() => {
          fetch(image.uri)
        .then((response) => response.blob())
        .then((blob) => {
          const imgRef = ref(
            storage,
            `${userID.uid}/avatar/${
              image.uri.split("/")[image.uri.split("/").length - 1]
            }`
          );

          uploadBytesResumable(imgRef, blob).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
              const docRef = doc(db, "users", userID);
              updateDoc(docRef, {
                avatar: { url: url, location: snapshot.ref.fullPath },
              });
            });
          });
        })
        .catch((error) => {
          console.error("Error fetching and uploading image:", error);
        });
        }).catch((error) => {
          console.log(error)
        });



        

      }else{

        fetch(image.uri)
        .then((response) => response.blob())
        .then((blob) => {
          const imgRef = ref(
            storage,
            `${userID}/avatar/${
              image.uri.split("/")[image.uri.split("/").length - 1]
            }`
          );

          uploadBytesResumable(imgRef, blob).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
              const docRef = doc(db, "users", userID);
              updateDoc(docRef, {
                avatar: { url: url, location: snapshot.ref.fullPath },
              });
            });
          });
        })
        .catch((error) => {
          console.error("Error fetching and uploading image:", error);
        });
    }

      }
      
  };



  const submit = (values, actions) => {
    // console.log(values, image);

    setSnack(true)

    if (image) {
      handleUpload();
      setImage("")
      // console.log("called");
    }

    const docRef = doc(db, "users", userID);
    updateDoc(docRef, {
      username: values.username,
      firstname: values.firstname,
      lastname: values.lastname,
      age: values.age,
    });
  };

  return (
    <SafeAreaView style={styles.droidSafeArea}>
      {userData && 
        <View style={styles.page}>
          {/* <View style={styles.header}>
            <Text style={styles.headText}>Settings</Text>
            <IconButton
              icon={"home"}
              iconColor="white"
              onPress={() => {
                navigation.navigate("home");
              }}
            />
          </View> */}

          <Navbar userData={userData.data()} navigation={navigation}/>
          <View style={styles.body}>
            {userData.data().avatar?.url ? (
              <TouchableOpacity onPress={pickImage}>
              <Image
                source={{ uri: userData.data().avatar.url }}
                style={{ width: 100, height: 100, borderRadius: 100, marginBottom:20 }}
              />
            </TouchableOpacity>
              
            ) : (
              <IconButton
                icon={"camera"}
                iconColor="#313866"
                onPress={pickImage}
              />
              
            )}

            {image && (
              <Image
                source={{ uri: image.uri }}
                style={{ width: 100, height: 100, borderRadius: 100 }}
              />
            )}
            <Formik
              initialValues={{
                username: userData.data().username || "",
                firstname: userData.data().firstname || "",
                lastname: userData.data().lastname || "",
                age: userData.data().age || "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values, actions) => {
                // Handle form submission here
                submit(values, actions);
              }}
            >
              {({ values, handleChange, handleSubmit, errors, touched }) => (
                <ScrollView>
                  <View style={styles.form}>
                    <FormTextInput
                      label="Username"
                      value={values.username}
                      onChangeText={handleChange("username")}
                      error={touched.username && errors.username}
                      autoCapitalize="none"
                    />

                    <FormTextInput
                      label="First Name"
                      value={values.firstname}
                      onChangeText={handleChange("firstname")}
                      error={touched.firstname && errors.firstname}
                      autoCapitalize="words"
                    />

                    <FormTextInput
                      label="Last Name"
                      value={values.lastname}
                      onChangeText={handleChange("lastname")}
                      error={touched.lastname && errors.lastname}
                      autoCapitalize="words"
                    />

                    <FormTextInput
                      label="Age"
                      value={values.age.toString()}
                      onChangeText={handleChange("age")}
                      error={touched.age && errors.age}
                      keyboardType='numeric'
                    />

                    <Button
                      mode="outline"
                      icon={"check"}
                      buttonColor="#D2DE32"
                      onPress={handleSubmit}
                    >
                      Save
                    </Button>
                  </View>
                </ScrollView>
              )}
            </Formik>
          </View>
        </View>}

        <Snackbar
        visible={snack}
        onDismiss={()=>setSnack(false)}
        duration={1000}
        >
        Saved
      </Snackbar>
      
        {loading &&  <ActivityIndicator style={{marginTop: "40%"}} size="large" color="#313866" animating={true}/> }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  droidSafeArea: {
    flex: 1,
    backgroundColor: "#D2DE32",
    // paddingTop: Platform.OS === "android" ? 25 : 0,
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
    alignItems: "center", // This will vertically center the text and icon
  },
  headText: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
    padding: 15,
  },
  body: {
    backgroundColor: "#fff",
    marginTop: 5,
    flex: 1,
    borderRadius: 15,
    padding: 15,
  },
  form: {
    display: "flex",
    rowGap: 10,
    width: "100%",
  },
  profilePicture:{
    padding:10

  }
});
