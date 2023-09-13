import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SignedInStack, SignedOutStack } from "./Navs";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../firebase-config";

export default function RootNavigation() {
  const [userUid, setUserUid] = useState(null);
  const auth = getAuth(app);

  onAuthStateChanged(
    auth,
    async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uidObjectStr = await AsyncStorage.getItem("UID");
        setUserUid(uidObjectStr);
        // console.log('root', uidObjectStr)
      } else {
        // User is signed out
        setUserUid(undefined);  
      }
    }
  );

  // useEffect(() => {
  //   // Function to retrieve the stored UID from AsyncStorage
  //   const getStoredUID = async () => {
  //     try {
  //       const uidObjectStr = await AsyncStorage.getItem('UID');
  //       // console.log("root",uidObjectStr)
  //       if (uidObjectStr) {
  //         const uidObject = JSON.parse(uidObjectStr);
  //         setUserUid(uidObject.uid);
  //       } else {
  //         setUserUid(null);
  //       }
  //     } catch (error) {
  //       console.error("Error while retrieving UID from AsyncStorage:", error);
  //       // Handle the error as needed (e.g., show an error screen)
  //       setUserUid(null);
  //     }
  //   };

  //   // Call the function to retrieve the stored UID
  //   getStoredUID();
  // }, [userUid]);

  // Render the appropriate stack based on the presence of the UID
  return userUid ? <SignedInStack /> : <SignedOutStack />;
}
