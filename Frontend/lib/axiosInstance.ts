import axios from "axios";

export const axiosInstance = axios.create({
    baseURL:"https://ai-writing-assistant-oww9.onrender.com",
    withCredentials:true
})