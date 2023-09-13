import { StyleSheet, View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import DeployForm from "../forms/DeployForm";
import { useState } from "react";

export default function DraftsItem({ navigation, data }) {
  // console.log('draft',data.id)
  const [form , setForm] = useState(false)

  return (
    <View style={styles.container}>
       <View style={styles.item}>
      <View style={{ width: "80%" }}>
        <Text style={styles.question}>{data.data().question}</Text>
        {data.data().options.map((item, index) => {
          return (
            <View key={index}>
              <Text style={styles.option}>{item}</Text>
            </View>
          );
        })}
        
      </View>
      <View>
      <IconButton
        onPress={() => navigation.navigate('edit', {pollId: data.id})}
        icon="pencil"
        iconColor="#313866"
      />
      <IconButton
        onPress={() => setForm(!form)}
        icon="antenna"
        iconColor="#313866"
      />

      </View>
      

      
    </View>


    {form && <DeployForm data={data} navigation={navigation}/>}
    </View>
   
  );
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
