import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  RefreshControl,
  ScrollView,
  Modal,
  Pressable,
  TouchableOpacity,
} from "react-native";
import CheckInItem from "../Components/CheckInItem";
import * as Location from "expo-location";

import Header from "../Components/Header";

import {
  showAllTasks,
  createTask,
  showAllCheckIns,
  postCheckIns,
} from "../Utils/api";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

export default function CheckIn() {
  const [todos, setTodos] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [address, setAddress] = useState();
  const [currentLocation, setCurrentLocation] = useState();
  useEffect(() => {
     if(address){
          setCurrentLocation({
               address:
                 address?.city + "," + address?.country + "," + address?.postalCode,
               latitude: location?.coords.latitude,
               longitude: location?.coords?.longitude,
             });
            
             
     }
    
  }, [address]);
  useEffect(()=>{
if(currentLocation){
     postCheckIns({
          address: currentLocation?.address,
          latitude: currentLocation?.latitude,
          longitude: currentLocation?.longitude,
        })
          .then((resp) => {
            console.log(resp, "//////////");
            if (resp.code == 201) {
              console.log("Check-in created successfully");
            }
          })
          .catch((err) => console.log(err));
}
  },[currentLocation])
  const dataLoader = () => {
    showAllCheckIns()
      .then((resp) => {
        setCheckins(resp.checkins);
      })
      .catch((err) => console.log(err));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    dataLoader();

    wait(2000).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    dataLoader();
  }, []);
  /*
  Some sample data
  { text: "buy coffee", key: "1" },
  { text: "create an app", key: "2" },
  { text: "play on the switch", key: "3" },
  */

  const renderItem = ({ item }) => {
    return <CheckInItem key={item.id} item={item} />;
  };

  //   const pressHandler = (key) => {
  //     setTodos((prevTodos) => {
  //       return prevTodos.filter((todo) => todo.key != key);
  //     });
  //   };

  const locationHandler = async () => {
    console.log("callea");
//     try {
     //  if (errorMsg) {
          (async () => {
               let { status } = await Location.requestForegroundPermissionsAsync();
               if (status !== "granted") {
               
                 return;
               }
        let location = await Location.getCurrentPositionAsync({});
        let provider = await Location.getProviderStatusAsync();
        let reverse = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude ?? 0,
          longitude: location.coords.longitude ?? 0,
        });
        console.log("provider", provider, location, reverse);
     //    setTimeout(() =>{
          setLocation(location);

          setAddress(reverse.length!==0 ? reverse[0] : null);
          console.log("addree", address, reverse[0]);
 
        
     
       
     })();
     //  }
//     } catch {
//       Alert.alert("Oops!", "Something went wrong", [
//         { text: "Try Again", onPress: () => console.log("alert closed") },
//       ]);
//     }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        console.log("Dismiss Keyboard");
      }}
    >
      <View style={styles.container}>
        <Header />

        <View style={styles.content}>
          {/* to form */}
          <TouchableOpacity onPress={locationHandler}>
            <Text style={styles.completedText}>+ Check In</Text>
          </TouchableOpacity>
          <View style={styles.list}>
            {currentLocation && (
              <View>
                <Text style={styles.completedText}>Current Location</Text>
                <CheckInItem item={currentLocation} currentLocation={true} />
              </View>
            )}
            <Text style={styles.completedText}>Previous Location</Text>
            <FlatList
              data={checkins}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 10,
    flex: 1,
  },
  completedText: {
    fontSize: 24,
    fontWeight: "bold",
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  input: {
    marginBottom: 10,
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  list: {
    flex: 1,
    marginTop: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 1,
    minHeight: 600,
    paddingHorizontal: 5,
    backgroundColor: "white",
    borderRadius: 10,
  },
});
