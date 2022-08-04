import { useNavigation } from "@react-navigation/native";
import React, { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  Platform,
  View,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

const AddTodo = ({ submitHandler, showModalHandler }) => {
  const [text, setText] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Complete", value: "completed" },
    { label: "Inprogress", value: "inprogress" },
    { label: "Incomplete", value: "incomplete" },
  ]);
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const navigation = useNavigation();
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification-response", response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }
  const changeHandler = (val) => {
    setText(val);
  };
  const changeDescription = (val) => {
    setDescription(val);
  };
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  function padTo2Digits(num) {
    return num.toString().padStart(2, "0");
  }

  function formatDate(date) {
    return (
      [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
      ].join("-") +
      " " +
      [
        padTo2Digits(date.getHours()),
        padTo2Digits(date.getMinutes()),
        padTo2Digits(date.getSeconds()),
      ].join(":")
    );
  }
  const handleConfirm = (date) => {
    setDueDate(formatDate(date));
    setSelectedDate(date);
    console.log("A date has been picked: ", formatDate(date), date);
    hideDatePicker();
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const submitAndClear = () => {
    // submitHandler({
    //   text,
    //   description,
    //   dueDate,
    //   status: value ?? "inprogress",
    // });
    // var dateInSeconds =
    // (new Date(selectedDate).getTime() - new Date().getTime()) / 1000;
    schedulePushNotification(2,2,"text","description");
    // changeHandler("");
    // changeDescription("");
    // setDueDate("");
    // setSelectedDate("");
    // setModalVisible(!modalVisible);
  };
  async function schedulePushNotification(id,time,title,description) {
    console.log("calledd1111111111")
    await Notifications.scheduleNotificationAsync({
    
      content: {
        title: title,
        body: description,
        data: { data: "goes here" },
      },
      trigger: { seconds: time },
    });
  }

  return (
    <View>
      {/*  <TextInput
        style={styles.input}
        placeholder="Add new todo..."
        onChangeText={changeHandler}
        value={text}
  />*/}
      <Modal
        animationType="slide"
        style={{ borderColor: "blue", borderWidth: 0.5 }}
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.headerView}>
              <Text style={styles.header}>New Task</Text>
            </View>
            <View style={{ paddingLeft: 10, width: "100%" }}>
              <TextInput
                style={styles.input}
                placeholder="Add new todo..."
                onChangeText={changeHandler}
                value={text}
              />
              <TextInput
                style={styles.input}
                placeholder="Description..."
                onChangeText={changeDescription}
                value={description}
              />
              {dueDate === "" ? (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <TouchableOpacity onPress={showDatePicker}>
                    <Text style={styles.input}>Due date</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={styles.input}>{dueDate}</Text>
              )}
              <DropDownPicker
                placeholder="Status"
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                style={{ width: "90%", marginVertical: 15 }}
                // mode="BADGE"
                // badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
              />
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="datetime"
                onChange={(e) => console.log(e)}
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={submitAndClear}
                >
                  <Text style={styles.textStyle}>add Task</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.textStyle}>Hide Modal</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        onPress={() => setModalVisible(!modalVisible)}
        // onPress={() => schedulePushNotification()}

        style={styles.submitContainer}
      >
        <Text style={styles.addNew}>+ Add new task</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("CheckIn")}
        style={styles.submitContainer}
      >
        <Text style={styles.addNew}>Location</Text>
      </TouchableOpacity>
      {/*  <Button
        onPress={() => submitAndClear(text)}
        title="add todo"
        color="#668aff"
              />*/}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 10,
    paddingHorizontal: 8,

    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    width: "100%",
    fontSize: 18,
  },
  submitContainer: {
    marginBottom: 10,
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  headerView: { width: "100%" },
  addNew: {
    fontSize: 22,
    fontWeight: "bold",
  },
  header: { fontSize: 20, fontWeight: "bold" },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
    marginTop: 22,
    width: "90%",

    // minWidth:500
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "100%",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    // elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
    width: "80%",
    marginBottom: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default AddTodo;
