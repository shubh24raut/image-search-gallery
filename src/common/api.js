// unsplashApi.js
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const ACCESS_KEY = process.env.REACT_APP_ACCESS_KEY;

const unsplashApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Client-ID ${ACCESS_KEY}`,
  },
});

export default unsplashApi;
