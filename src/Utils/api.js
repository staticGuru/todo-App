import axios from "axios";

const baseURL = "https://todo-test.digitaltolk.com/api/";
// const baseURL = "https://simple-todo-rn.herokuapp.com/tasks";
const token="Zl49StyUu9721TFoRHfDqGmEVikCKNhJayGUgDvK";

const instance = axios.create({
  baseURL: baseURL,
  timeout: 1000,
  headers: {"Authorization" : `Bearer ${token}`, "Content-Type": "application/json" },
});

const showAllTasks = async () => {
  try {
    const response = await instance.get("/tasks");
    return response.data;
  } catch (error) {

    console.log(error);
  }
};
const showAllCheckIns = async () => {
  try {
    const response = await instance.get("/checkins");
    return response.data;
  } catch (error) {

    console.log(error);
  }
};

const createTask = async (taskData) => {
  try {
    const response = await instance.post("/tasks", taskData);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
const postCheckIns = async (checkInData) => {
  try {
    const response = await instance.post("/checkins", checkInData);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const deleteTask = async (taskID) => {
  try {
    const response = await instance.delete(`/tasks/${taskID}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export { showAllTasks, createTask, deleteTask,showAllCheckIns,postCheckIns};
