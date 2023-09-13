import { StyleSheet } from "react-native";

export const fonts = StyleSheet.create({
    regular: 'HelveticaNeue',
    bold: 'HelveticaNeue-Bold',
  });

  
  export const colors = StyleSheet.create({
    primary: '#B9FFF8', 
    secondary: '#6FEDD6', 
    third:'#FF9551',
    fourth:"#FF4A4A",
    white: '#FFFFFF',
    black: '#000000',
    gray: '#657786',
  })
  

  export const textStyles = StyleSheet.create({
    title: {
      fontFamily: fonts.bold,
      fontSize: 24,
      color: colors.black,
    },
    subtitle: {
      fontFamily: fonts.regular,
      fontSize: 18,
      color: colors.gray,
    },
    body: {
      fontFamily: fonts.regular,
      fontSize: 16,
      color: colors.black,
    },
  });
  

  export const inputStyles = StyleSheet.create({
    inputContainer: {
      width: '80%',
      marginBottom: 20,
    },
    input: {
      fontFamily: fonts.regular,
      fontSize: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.gray,
      paddingVertical: 8,
    },
  });
  

  export const buttonStyles = StyleSheet.create({
    button: {
      backgroundColor: colors.primary,
      borderRadius: 5,
      paddingVertical: 12,
      paddingHorizontal: 24,
      alignItems: 'center',
    },
    buttonText: {
      fontFamily: fonts.bold,
      fontSize: 18,
      color: colors.white,
    },
  });


  export const containerStyles = StyleSheet.create({
    centeredContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 40,
    },
  });
  
  export const navigationStyles = StyleSheet.create({
    headerStyle: {
      backgroundColor: colors.primary,
      elevation: 0, // for Android
      shadowOpacity: 0, // for iOS
    },
    headerTitleStyle: {
      fontFamily: fonts.bold,
      fontSize: 20,
      color: colors.white,
    },
    headerTintColor: colors.white,
  });
  