import axios from "axios";

const API = axios.create({
   baseURL:
    "http://localhost:5000/api",
   // "https://trip-planner-pw9x.onrender.com/api",
   
});

export default API;