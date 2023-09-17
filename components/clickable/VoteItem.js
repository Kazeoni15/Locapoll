import { View } from "react-native";

export default function VoteItem({navigation}){
    return (
        <View>

        </View>
    )
}


const styles = StyleSheet.create({
    item: {
      marginTop: 5,
      flexDirection: "row",
      padding: 20,
      justifyContent: "space-between",
      columnGap: 5,
      // alignItems: "center",
      // width: "100%",
      
    },
    question: {
      color: "#313866",
      fontSize: 18,
      fontWeight: "bold",
      padding: 3,
    },
    option: {
      color: "#313866",
    },
    container:{
      backgroundColor: "#D2DE32",
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "#313866",
    }
  });