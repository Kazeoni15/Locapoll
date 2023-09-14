import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Formik } from "formik";
import * as yup from "yup";
import FormTextInput from "../auth/FormTextInput";
import { HelperText, Button, TextInput } from "react-native-paper";
import { Timestamp, addDoc, collection, doc } from "firebase/firestore";
import { db } from "../../firebase-config";

const DeployForm = ({userID, data, navigation, location }) => {
  const validationSchema = yup.object().shape({
    radius: yup
      .number()
      .positive("Radius must be a positive number")
      .max(6371, "Maximum radius is the Earth's radius (6371 km)")
      .required("Radius is required"),
  });

  const handleSubmit = async (values) => {
    // Handle form submission here

    const payload = {
      user:userID,
      radius: parseInt(values.radius),
      question: data.data().question,
      location: location,
      deployed: Timestamp.now(),
      options: data.data().options.map((option) => ({
        text: option,
        votes: [], // Initialize votes to 0
      })),
    };

    try {
      await addDoc(collection(db, "deployed"), payload);

      navigation.navigate("home");
    } catch (err) {
      console.log(err);
    }
  };

  const initialValues = {
    radius: "",
  };
  return (
    <View style={styles.container}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={{ width: "80%" }}>
            <TextInput
              label={"Set a Radius (Km)"}
              value={values.radius}
              keyboardType="numeric"
              onChangeText={handleChange("radius")}
              mode="flat"
              underlineColor={"#D2DE32"}
              activeUnderlineColor={"#016A70"}
              textColor={"#016A70"}
            />
            {errors.radius && (
              <HelperText type="error">{errors.radius}</HelperText>
            )}
            <Button
              style={{ marginTop: 10 }}
              icon={"check"}
              textColor="#313866"
              mode="text"
              onPress={handleSubmit}
            >
              Deploy
            </Button>
          </View>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 25,
  },
  input: {
    width: 300,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  error: {
    color: "red",
  },
});

export default DeployForm;
