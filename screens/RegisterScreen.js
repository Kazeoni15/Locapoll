import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import FormTextInput from '../components/auth/FormTextInput';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { db} from '../firebase-config'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Timestamp, collection, doc, getCountFromServer, query, setDoc, where } from 'firebase/firestore';



const validationSchema = Yup.object().shape({
    email: Yup.string().email().required('Email is required'),
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
    confirmPassword: Yup
    .string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Password confirmation is required'),
  });
  
  const RegisterScreen = ({ navigation }) => {


    const auth = getAuth()

    const handleRegister = async (values, actions) => {
      console.log('pressed')
      try {
        if (
          (
            await getCountFromServer(
              query(
                collection(db, "users"),
                where("username", "==", values.username)
              )
            )
          ).data().count !== 0
        ) {
          throw { code: "existing-username" };
        }

        const r = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );

        await AsyncStorage.setItem('UID', JSON.stringify({ uid: r.user.uid }));

        try {
          await setDoc(doc(db, "users", r.user.uid), {
            email: values.email,
            username: values.username,
            create: Timestamp.now(),
          });

          




          

       
        } catch (err) {
          console.log(err);
        }
      } catch (err) {
        console.log(err)
        switch (err.code) {
          case "existing-username":
            actions.setFieldError("username", "Username is already taken");
            break;
          case "auth/weak-passwork":
            actions.setFieldError("password", "Password too weak");
            break;
          default:
            actions.setFieldError(
              "confirm-password",
              err.code ?? "Something went wrong. Please try again"
            );
            break;
        }
      }
        // try {
        //   // Create a user in Firebase Authentication
        //   const userCredential = await createUserWithEmailAndPassword(
        //     auth,
        //     values.email,
        //     values.password
        //   );
      
        //   // User is signed up successfully
        //   const user = userCredential.user;
        //   console.log('User signed up:', user);
      
        //   // Add user data to Firestore "users" collection
        //   await addUserDataToFirestore(user.uid, {
        //     email: values.email,
        //     username:values.username
        //     // You can add other user information here
        //   });
      
        //   // Navigate to the home screen or any other screen
        //   // navigation.navigate('Home');
        // } catch (error) {
        //   console.error('Error signing up:', error);
        //   // Handle and display the error to the user as needed
        // }
      
        // After successful registration, navigate to the home screen or any other screen
        // navigation.navigate('Home');
      };
      
      // Function to add user data to Firestore "users" collection
      const addUserDataToFirestore = async (userId, userData) => {
        try {
          const userRef = doc(db, 'users', userId);
          await setDoc(userRef, userData);
          console.log('User data added to Firestore');
          // navigation.navigate('home');
        } catch (error) {
          console.error('Error adding user data to Firestore:', error);
          // Handle and display the error to the user as needed
        }
      };
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>LocaPoll</Text>
        <Formik
          initialValues={{ username:'', email: '', password: '', confirmPassword:'' }}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => handleRegister(values, actions)}
        >
          {({ handleChange, handleSubmit, values, errors, touched }) => (
            <View style={styles.form}>
              <FormTextInput
                label="Email"
                value={values.email}
                onChangeText={handleChange('email')}
                error={touched.email && errors.email}
                autoCapitalize="none"
              />
              <FormTextInput
                label="Username"
                value={values.username}
                onChangeText={handleChange('username')}
                error={touched.email && errors.username}
                autoCapitalize="none"
              />
              <FormTextInput
                label="Password"
                value={values.password}
                onChangeText={handleChange('password')}
                autoCapitalize="none"
                error={touched.password && errors.password}
               
              />
              <FormTextInput
                label="Confirm Password"
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                autoCapitalize="none"
                error={touched.confirmPassword && errors.confirmPassword}
                
              />
             
              <Button buttonColor="#D2DE32" textColor="#FFFFDD" mode="elevated" onPress={handleSubmit}>
                Register
              </Button>
            </View>
          )}
        </Formik>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container:{
      backgroundColor:'#313866',
      flex:1,
      paddingTop:50,
      alignItems:'center',
      
      
    }, form:{
      display:"flex",
      rowGap:10,
      width:"80%"

    }, title: {
      fontWeight:'bold',    
      fontSize: 24,
      color: "#D2DE32",
      letterSpacing:5,
      marginBottom: 30
    },
    
  });
  
  
  export default RegisterScreen;
