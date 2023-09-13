import React from 'react';
import { View, SafeAreaView, StyleSheet, Platform} from 'react-native';
import { Text, BottomNavigation } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../hooks/useAuth';

const Tab = createBottomTabNavigator();


export default function SearchPoll() {
  const { user } = useAuth();


  return (
    <SafeAreaView style={styles.droidSafeArea}>
      <View style={styles.header}>
      <Text>Welcome {user?.email}!</Text>
      
    </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  droidSafeArea: {
      flex: 1,
      backgroundColor:"#313866",
      paddingTop: Platform.OS === 'android' ? 25 : 0
  },
  header:{
    // backgroundColor:'red'
  }
});