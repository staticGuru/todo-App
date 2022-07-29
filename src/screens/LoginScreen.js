import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, View,Image,TextInput,Button,KeyboardAvoidingView,TouchableOpacity} from "react-native";
import { useNavigation } from "@react-navigation/native";
// import { Button } from "react-native-elements/dist/buttons/Button";
// import { Image } from "react-native-elements/dist/image/Image";
// import { Input } from "react-native-elements/dist/input/Input";
// import { auth } from "../firebase";

const LoginScreen = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const navigation=useNavigation();
  const signIn = async() => {
    console.log("SignIn stage");
    try {
     await AsyncStorage.setItem('@storage_Email', email);
     await AsyncStorage.setItem('@storage_Password', password);
     navigation.navigate("Main");
   } catch (e) {
     // saving error
   }
//     auth.signInWithEmailAndPassword(email, password).catch((err) => alert(err));
  };
  useEffect(async() => {

  
     if(await AsyncStorage.getItem('@storage_Email')){
          navigation.navigate("Main");
     }

  }, []);
  return (
    <View style={styles.Container}>
      <StatusBar style="light" />

     
      <Text style={styles.header}>My Todo App</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          autofocus
          type="email"
          value={email}
          style={styles.input}
          onChangeText={(text) => setemail(text)}
        />
        <TextInput
          placeholder="password"
          type="password"
          secureTextEntry
          value={password}
          style={styles.input}
          onChangeText={(password) => setpassword(password)}
          onSubmitEditing={signIn}
        />
      </View>
      <View style={styles.buttonContainer}>
      <TouchableOpacity onPress={signIn} style={styles.buttonContainer}><Text style={styles.buttonText}>Login</Text></TouchableOpacity>
    {/*    <Button
          title="Login"
          st={styles.button}
          onPress={signIn}
          type="outline"
      />*/}
     {/*   <Button
          title="Register"
          containerStyle={styles.button}
          type="outline"
          onPress={() => navigation.navigate("Register")}
      />*/}
      </View>
      <View style={{ height: 100 }} />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "white",
  },
  inputContainer: {
    width: '80%',
  },
  input:{
    marginBottom:20,
    borderBottomWidth:2,
    borderColor:'#668aff',
    fontSize:24
  },
  header:{
    fontSize:28,
    fontWeight: "bold",
    color: "#668aff",
    marginBottom:20
  },
  buttonContainer: {
    width: '50%',
    marginTop: 10,
    backgroundColor: "#668aff",
    borderRadius:10,
    paddingVertical:10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText:{
   color: 'white',
   fontSize:20,
   fontWeight: 'bold',
  }
});
