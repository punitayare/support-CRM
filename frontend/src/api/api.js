import axios from "axios";

const api = axios.create({
  baseURL: "https://support-crm-q58l.onrender.com",
});

export default api;