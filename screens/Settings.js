import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { useDocument } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { db } from "../firebase-config";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { useEffect, useState } from "react";
import SettingsScreen from "../components/pages/SettingsScreen";

export default function Settings ({ navigation }) {
    const [userUid, setUserUid] = useState(null);


    useEffect(() => {
        // Function to retrieve the stored UID from AsyncStorage
        const getStoredUID = async () => {
          try {
            const uidObjectStr = await AsyncStorage.getItem('UID');
            // console.log("root",uidObjectStr)
            if (uidObjectStr) {
              const uidObject = JSON.parse(uidObjectStr);
              setUserUid(uidObject.uid);
            } else {
              setUserUid(null);
            }
          } catch (error) {
            console.error("Error while retrieving UID from AsyncStorage:", error);
            // Handle the error as needed (e.g., show an error screen)
            setUserUid(null);
          }
        };
    
        // Call the function to retrieve the stored UID
        getStoredUID();
      }, []);
    
      // console.log("home", userUid)

  return (
    <SafeAreaView style={styles.droidSafeArea}>

      {/* {userUid ? <Text>{userUid}</Text>: <Text>Loading...</Text>} */}

        {userUid ? <SettingsScreen navigation={navigation} userID={userUid}/>: <Text>Loading...</Text>}
  
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  droidSafeArea: {
    flex: 1,
    backgroundColor: "#D2DE32",
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
})