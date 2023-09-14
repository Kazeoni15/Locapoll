import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  Platform,
  Image,
  ScrollView,
} from "react-native";
import {
  Text,
  Button,
  IconButton,
  Searchbar,
  Drawer,
} from "react-native-paper";

import { useCollection, useDocument } from "react-firebase-hooks/firestore";

import {
  doc,
  getDoc,
  runTransaction,
  updateDoc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import {app, db} from "../../firebase-config"
import { getAuth, signOut } from "firebase/auth";

import Navbar from "../nav/Navbar";
import ListLocation from "../list/ListLocation";
import { PieChart } from "react-native-chart-kit";

export default function PollScreen({ navigation, userID, route }) {
  //   console.log("HomeScreen",userID)
  const auth = getAuth(app);
  //   console.log(auth)
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [userData, loading, error] = useDocument(doc(db, "users", userID), {
    snapshotListenOptions: { includeMetadataChanges: false },
  });

  const [poll, Ploading, Perror] = useDocument(
    doc(db, "deployed", route.params.pollID),
    {
      snapshotListenOptions: { includeMetadataChanges: false },
    }
  );

  // console.log(poll.data())
  let colors = [
    "#33BBC5",
    "#900C3F",
    "#F94C10",
    "#1A5D1A",
    "#321E1E",
    "#454545",
  ];

  const votesData = poll?.data().options.map((option, index) => {
    // console.log(option)
    return ({
    name: option.text,
    votes: option.votes.length,
    color: colors[index]
  })});


  async function voteInPoll(pollId, userId, selectedOption) {
    console.log(pollId, userId, selectedOption)
    const pollRef = doc(db, "deployed", pollId); // Replace 'deployed' with the actual collection name
    const userRef = doc(db, "users", userId); // Replace 'users' with the actual collection name
   

    try {
      await runTransaction(db, async (transaction) => {
        
        // Get the poll data and user data
        const pollDoc = await getDoc(pollRef, transaction);
        const userDoc = await getDoc(userRef, transaction);

        if (!pollDoc.exists() || !userDoc.exists()) {
          throw new Error("Poll or user not found");
        }

        // Check if the user has already voted for this poll
        const userVotedForPoll = userDoc
          .data()
          .votes.some((vote) => vote.pollId === pollId);

         

         
        // Remove the user from any existing vote arrays in the poll
        const updatedVotes = pollDoc.data().options.map((option) => ({
          text: option.text,
          votes: option.votes.filter((voterId) => voterId !== userId),
        }));

        // Push the user into the selected option's vote array
        const selectedOptionIndex = updatedVotes.findIndex(
          (option) => option.text === selectedOption
        );
        updatedVotes[selectedOptionIndex].votes.push(userId);

        // Update the poll document with the modified votes array
        transaction.update(pollRef, { options: updatedVotes });

        // Update the user's data to record their vote for this poll
        if (userVotedForPoll) {
          // Remove the previous vote for this poll
          transaction.update(userRef, {
            votes: userDoc
              .data()
              .votes.filter((vote) => vote.pollId !== pollId),
          });
        }

        // Push the new vote information into the user's votes array
        transaction.update(userRef, {
          votes: arrayUnion({
            pollId,
            question: pollDoc.data().question,
            votedFor: selectedOption,
          }),
        });
      });

      console.log("Vote recorded successfully.");
    } catch (error) {
      console.error("Error voting:", error);
    }
  }

 
  
  const chartConfig = {
    backgroundColor: 'white',
    backgroundGradientFrom: 'white',
    backgroundGradientTo: 'white',
    color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
  };
  return (
    <SafeAreaView style={styles.droidSafeArea}>
      <View style={styles.page}>
        {userData && (
          <Navbar navigation={navigation} userData={userData.data()} />
        )}

        {poll?.data() && (
          <View>
            <View style={styles.body}>
              <Text style={styles.title}>{poll.data().question}</Text>
              <ScrollView style={{ width: "100%" }}>
                <View
                  style={{
                    width: "100%",
                    alignItems: "center",
                    marginTop: 20,
                    marginBottom: 200,
                    rowGap: 15,
                    
                  }}
                >
                  {poll.data().options.map((item, index) => {
                    return (
                      <View
                        style={{ width: "100%", alignItems: "center" }}
                        key={index}
                      >
                        <Button
                          style={{ width: "80%" }}
                          mode="contained"
                          buttonColor={colors[index]}
                          onPress={() => voteInPoll(poll.id, userID, item.text)}
                        >
                          {item.text}
                        </Button>
                      </View>
                    );
                  })}
                  <View style={{ marginLeft:"30%"}}>
                  <PieChart
        data={votesData}
        width={370}
        height={200}
        chartConfig={chartConfig}
        accessor="votes"
        backgroundColor="transparent"
        paddingLeft="15"
        hasLegend={false}
        center={[10, 10]}
        absolute
      />

                  </View>


                </View>
              </ScrollView>
            </View>
          </View>
        )}

        {loading && <Text>Loading...</Text>}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  droidSafeArea: {
    flex: 1,
    backgroundColor: "#D2DE32",
    // paddingTop: Platform.OS === "android" ? 25 : 0,
  },
  page: {
    backgroundColor: "#313866",
    marginTop: 5,
    flex: 1,
    borderRadius: 10,
    // padding: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between", // This will align text and icon on opposite sides
    alignItems: "center",
  },
  headerel1: {
    flexDirection: "row",
    gap: 10,
    paddingTop: 25,
    paddingLeft: 15,

    // alignItems: "center", // This will vertically center the text and icon
  },
  headText: {
    fontSize: 20,
    fontWeight: 800,
    color: "white",
    paddingTop: 5,
  },
  body: {
    // display: "flex",
    backgroundColor: "white",
    alignItems: "center",
    paddingTop: 20,
    borderRadius: 25,
    zIndex: 0,

    width: "100%",
  },
  searchbar: {
    width: "95%",
    marginTop: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 800,
    color: "#313866",
    padding:10
  },
  operations: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    // backgroundColor:'red',
    alignItems: "center",
    paddingLeft: 15,
  },
  items: {
    paddingTop: 20,
  },
});
