import { collection, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { db } from "../../firebase-config";
import { useEffect, useState } from "react";
import PollItem from "../clickable/PollItem";

export default function ListLocation ({navigation, location}){
    const [value, Vloading, Verror] = useCollection(
        collection(db, `deployed`) ,
        {
          snapshotListenOptions: { includeMetadataChanges: false },
        }
      );
    const [list, setList] = useState([])
    // console.log(value.docs.length)

     

     

     useEffect(()=>{
        const a = value?.docs.filter((item)=>{
            // console.log(item.data())
            if (calculateDistance(item.data().location.coords.latitude, item.data().location.coords.longitude, location.coords.latitude, location.coords.longitude, item.data().radius)) return item
    
    
         })
         setList(a)

     },[value])
     

     function calculateDistance(lat1, lon1, lat2, lon2, radius) {
        const earthRadiusKm = 6371; // Radius of the Earth in kilometers
      
        // Convert latitude and longitude from degrees to radians
        const lat1Rad = toRadians(lat1);
        const lon1Rad = toRadians(lon1);
        const lat2Rad = toRadians(lat2);
        const lon2Rad = toRadians(lon2);
      
        // Calculate the differences between coordinates
        const latDiff = lat2Rad - lat1Rad;
        const lonDiff = lon2Rad - lon1Rad;
      
        // Calculate the Haversine distance
        const a =
          Math.sin(latDiff / 2) ** 2 +
          Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(lonDiff / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distanceKm = earthRadiusKm * c;
      
        // console.log(distanceKm, radius)
        // Compare the calculated distance with the provided radius
        // console.log(distanceKm <= radius)
        return distanceKm <= radius;
      }
      
      // Function to convert degrees to radians
      function toRadians(degrees) {
        return (degrees * Math.PI) / 180;
      }

      



      return(
        <View style={{paddingBottom:300}}>
            { list?.map((item, index)=>{
                return(
                <View style={{paddingBottom:20, rowGap:15}} key={index}>
                <PollItem data={item} navigation={navigation}/>
              
                
                
                </View>
                )
            })}
           
           

        </View>
      )

}