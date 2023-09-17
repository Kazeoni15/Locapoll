import React, { useEffect, useState } from "react";
import { View, SafeAreaView, StyleSheet, Platform, Image } from "react-native";
import {
  Text,
  Button,
  IconButton,

  TextInput,
  HelperText,
  ActivityIndicator,
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
  deleteDoc,
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

export default function EditPollScreen ({navigation, userID, route}){

   

    const [userData, loading, error] = useDocument(doc(db, "users", userID), {
        snapshotListenOptions: { includeMetadataChanges: false },
      });

      const [draft, dloading, derror] = useDocument(doc(db, `users/${userID}/drafts` ,route.pollId), {
        snapshotListenOptions: { includeMetadataChanges: false },
      });
   
    
    
    return(
       <SafeAreaView style={styles.droidSafeArea}>
      {userData && (
        <View style={styles.page}>
          
          <Navbar userData={userData.data()} navigation={navigation} />
          <View style={styles.body}>
            {draft && <Formik
              initialValues={{ question: draft?.data()?.question || "", options: draft?.data()?.options || "" }}
              validationSchema={Yup.object().shape({
                question: Yup.string().required("Question is required"),
                options: Yup.array()
                  .of(Yup.string().required("Option is required"))
                  .min(2, "Minimum of 2 options required"),
              })}
              onSubmit={async (values, actions) => {
                // Handle form submission, values will contain the question and options
                console.log("Form submitted:", values);

                await updateDoc(doc(db, `users/${userID}/drafts`, route.pollId), {
                  question: values.question,
                  options: values.options,
                  lastmodified: Timestamp.now(),
                  // votes: [],
                });

                navigation.navigate("drafts");
              }}
            >
              {({ values, handleChange, handleSubmit, errors }) => (
                <ScrollView style={styles.form}>
                  <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:"center"}}>
                    <Text style={styles.title}>Edit Draft</Text>
                    <IconButton icon='delete' iconColor="red" onPress={async ()=>{

                        try{
                            navigation.navigate('drafts')  
                            await deleteDoc(doc(db, `users/${userID}/drafts`, route.pollId));
                            

                        } catch (err){
                            console.log(err)

                        }

                    }}/>

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
            </Formik>}
          
        

          




            
          </View>
        </View>
      )}

      {loading &&  <ActivityIndicator style={{marginTop: "40%"}} size="large" color="#313866" animating={true}/>}
    </SafeAreaView>
    )

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
        display: "flex",
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