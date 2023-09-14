import { StyleSheet, TouchableOpacity, View } from "react-native";
import { IconButton, Text } from "react-native-paper";

export default function PollItem({navigation, data}){
    return(
        <TouchableOpacity onPress={()=>{navigation.navigate('poll', {pollID:data.id})}} style={styles.container}>
       <View style={styles.item}>
      <View style={{ width: "80%" }}>
        <Text style={styles.question}>{data.data().question}</Text>
        {data.data().options.map((item, index) => {
          return (
            <View  key={index}>
              <Text style={[styles.option,]}>{item.text}</Text> 
            </View>
          );
        })}
        
      </View>
      <View >
        <IconButton icon='vote' iconColor="#313866"/>
        {/* <Text style={{fontSize:25, fontWeight:'bold', color:""}}>Vote</Text> */}
      
      

      </View>
      

      
    </View>


   
    </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    item: {
        // marginTop: 5,
        flexDirection: "row",
        padding: 20,
        justifyContent: "space-between",
        columnGap: 5,
        alignItems: "center",
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
        paddingLeft:15
        // backgroundColor:'red'
      },
      container:{
        backgroundColor: "#D2DE32",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#313866",
      }
})