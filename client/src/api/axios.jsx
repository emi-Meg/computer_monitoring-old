import axios from "axios";

export default axios.create({
  baseURL: "http://136.239.196.178:8000",
  // baseURL: "http://10.50.2.220:8000",
  // baseURL: "http://localhost:8000",
  withCredentials: true,
});
