import axios from "axios";

// axios.defaults.withCredentials = true;
let baseURL = process.env.SERVER_URI;
const app = axios.create({
  baseURL,
  withCredentials: true,
});

app.interceptors.response.use((response) => response);

export default app;
