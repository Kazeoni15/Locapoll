import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, signOut } from 'firebase/auth';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { app } from '../../firebase-config';

export default function Navbar({ navigation, userData }) {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerVisible(!isDrawerVisible);
  };

  const navigateTo = (screenName) => {
    navigation.navigate(screenName);
    setIsDrawerVisible(false); // Close the drawer after navigation
  };

  const logout =async () => {
   
    try {
   

      // Add any additional logout logic here (e.g., sign out from Firebase)
      signOut(getAuth(app));
      // Navigate to your sign-in screen or any other appropriate screen
      // For example, if you're using React Navigation, you can navigate like this:
      // navigation.navigate('SignIn');
    } catch (error) {
      console.error("Error while logging out:", error);
      // Handle any logout errors as needed
    }
  }

  return (
    <View>
      <View style={styles.header}>
        <View style={styles.headerel1}>
          {userData.avatar ? (
            <Image
              source={{ uri: userData.avatar.url }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 100,
                marginBottom: 20,
              }}
            />
          ) : (
            <IconButton icon="account-circle-outline" iconColor="white" />
          )}
          <Text style={styles.headText}>{userData.username}</Text>
        </View>
        <View>
          <IconButton icon="menu" iconColor="white" onPress={toggleDrawer} />
        </View>
      </View>

      {isDrawerVisible && (
        <View style={styles.customDrawer}>
          <Button
            icon={'home'}
            onPress={() => navigateTo('home')}
            textColor='white' // Replace with your screen name
          >
            Home
          </Button>
          <Button
            icon={'cog'}
            onPress={() => navigateTo('settings')}
            textColor='white' // Replace with your screen name
          >
            Settings
          </Button>
          <Button
            icon={'file'}
            onPress={() => navigateTo('drafts')}
            textColor='white' // Replace with your screen name
          >
            Drafts
          </Button>
          <Button
            icon={'vote'}
            onPress={() => navigateTo('myvotes')}
            textColor='white' // Replace with your screen name
          >
            My Votes
          </Button>
          {/* Add more TouchableOpacity items for other navigation options */}
          <Button
           onPress={()=>logout()}
           textColor='white'
           icon={'logout'}
           >
            Logout
          </Button>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#313866',
  },
  headerel1: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 25,
    paddingLeft: 15,
    
  },
  headText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    paddingTop: 5,
  },
  customDrawer: {

    // position: 'absolute',
     alignItems:"flex-start",
     rowGap:15,
     paddingBottom:15
    
    // width: "50%", // Adjust the width as needed
    // height: "100%",
    // backgroundColor: 'red',
    
  },
  drawerItem: {
    padding: 16,
    // borderBottomColor: '#ccc',
    // borderBottomWidth: 1,
  },
});
