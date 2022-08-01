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
} from "react-native";

import Header from "./Header";
import TodoItem from "./TodoItem";
import AddTodo from "./AddTodo";

import { showAllTasks, createTask } from "../Utils/api";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

export default function Main() {
  const [todos, setTodos] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const dataLoader = () => {
    showAllTasks()
      .then((resp) => {
        setTodos(resp.tasks);
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
    return (
      <TodoItem
        key={item.id}
        item={item}
        pressHandler={pressHandler}
        dataLoader={dataLoader}
      />
    );
  };

  const pressHandler = (key) => {
    setTodos((prevTodos) => {
      return prevTodos.filter((todo) => todo.key != key);
    });
  };

  const submitHandler = (data) => {
    const { text, description, status, dueDate } = data;
    if (text && description && status && dueDate) {
      
      createTask({
        title: text??'',
        description: description??'description',
        status: status??'Inprogress',
        due_at: dueDate??'Date',
      })
        .then((resp) => {
          if (resp.message === "Task created successfully") {
            showAllTasks().then((res) => {

              setTodos(res.tasks);
              dataLoader();
            });
          }
        })
        .catch((err) => console.log(err));
    } else {
      console.log("empty string");
      Alert.alert("Oops!", "Todo must have title", [
        { text: "Understood", onPress: () => console.log("alert closed") },
      ]);
    }
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

        <ScrollView scrollEnabled={true} style={styles.content}>
          {/* to form */ }
          <AddTodo submitHandler={submitHandler} />
          <View style={styles.list}>
          <Text style={styles.completedText}>Inprogress</Text>
            <FlatList
            nestedScrollEnabled={true}
            listKey={1}
              data={todos.filter((todo) => todo.status !== "completed")}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          <Text style={styles.completedText}>Completed</Text>
            <FlatList
            nestedScrollEnabled={true}
            listKey={2}
              data={todos.filter((todo) => todo.status === "completed")}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          </View>
        </ScrollView>
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
    padding: 20,
    flex: 1,
  },
  completedText: {
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: "#668aff",
    paddingVertical: 10,
    paddingHorizontal:10,
    borderRadius:5,
    marginVertical:10

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
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minHeight: 600,
    paddingHorizontal: 5,
    backgroundColor: "white",
    borderRadius: 10,
  },
});
