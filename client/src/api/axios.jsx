import axios from "axios";

export default axios.create({
    baseURL: "https://comonitoringserver.smctgroup.ph/",
    withCredentials: true
});
