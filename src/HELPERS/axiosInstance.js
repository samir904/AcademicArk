import axios from "axios";

//const base_url="http://localhost:5014/api/v1"
const base_url="https://academicark.onrender.com/api/v1"

const axiosInstance=axios.create();
axiosInstance.defaults.baseURL=base_url;
axiosInstance.defaults.withCredentials=true;

export default axiosInstance;
