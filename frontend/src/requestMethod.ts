import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_SERVER;

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});
