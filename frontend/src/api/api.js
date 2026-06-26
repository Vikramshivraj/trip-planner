import axios from "axios";

const API = axios.create({
  baseURL: "https://trip-planner-pw9x.onrender.com/api",
});

export default API;