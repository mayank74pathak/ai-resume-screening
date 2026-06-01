import axios from "axios";
 
const API = axios.create({
  baseURL: "https://ai-resume-screening-6.onrender.com/",
});
 
export default API;
