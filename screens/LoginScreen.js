import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ActivityIndicator, Button, TextInput } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import FormTextInput from "../components/auth/FormTextInput";
import {firebase} from "../firebase-config"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";


const validationSchema = Yup.object().shape({
  email: Yup.string().email().required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const LoginScreen = ({ navigation }) => {
  const [activity, setActivity] = useState(false)

  const auth = getAuth()
  

  const handleLogin = async (values, actions) => {

    setActivity(true)


    try{
      const r = await signInWithEmailAndPassword(auth, values.email, values.password)

      console.log(r.user.uid)
      
      await AsyncStorage.setItem('UID', JSON.stringify({ uid: r.user.uid }));
      

    } catch (err){
      setActivity(false)
      console.log("login error: ", err)
      actions.setFieldError("password", "User or Password are incorrect. Try Again.")

    }
    
      
  };

  const handleRegister = () => {
    // Perform authentication logic with values.email and values.password
    // If successful, navigate to the home screen
    navigation.navigate("register");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LocaPoll</Text>

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => handleLogin(values, actions)}
      >
        {({ handleChange, handleSubmit, values, errors, touched }) => (
          <View style={styles.form}>
            <FormTextInput
              label="Email"
              value={values.email}
              onChangeText={handleChange("email")}
              error={touched.email && errors.email}
              autoCapitalize="none"
            />
            <FormTextInput
              label="Password"
              value={values.password}
              onChangeText={handleChange("password")}
              autoCapitalize="none"
              error={touched.password && errors.password}
              
            />

            <Button
              buttonColor="#D2DE32"
              textColor="#FFFFDD"
              mode="elevated"
              onPress={handleSubmit}
            >
              Login
            </Button>
            <Button textColor="#A2C579" mode="text" onPress={handleRegister}>
              Don't have an account? Register
            </Button>
            <ActivityIndicator animating={activity} color={"#D2DE32"} />
          </View>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#313866",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    display: "flex",
    rowGap: 10,
    width: "80%",
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    color: "#D2DE32",
    letterSpacing: 5,
    marginBottom: 30,
  },
});

export default LoginScreen;
