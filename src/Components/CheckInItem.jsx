import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";

const CheckInItem = ({ item,currentLocation }) => {
  return (
    <React.Fragment>
      <View style={styles.item}>
        <View onPress={() => {}}>
          {currentLocation?<MaterialIcons name="my-location" size={30} color="red" />:<MaterialIcons name="location-pin" size={30} color="#4a7dff" />}
        </View>
        <View style={{ flexDirection: "column",marginLeft:10 }}>
          <Text style={styles.address} numberOfLines={1}>{item.address.trim()}</Text>
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <Text style={styles.subText}>
              {parseFloat(item.latitude).toFixed(4)}° N,
            </Text>
          
              <Text style={styles.subText}>
                {parseFloat(item.longitude).toFixed(4)}° E
              </Text>
          </View>
        </View>
      </View>
    </React.Fragment>
  );
};

export default CheckInItem;

const styles = StyleSheet.create({
  item: {
    padding: 10,
    marginTop: 2,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  subText:{ marginLeft: 5, fontSize: 18,color:"#748DA6"},
  address:{ fontSize: 24,fontWeight:"600" }
});
