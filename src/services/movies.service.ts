import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import axiosRetry from "axios-retry";


dotenv.config({ path: path.join(__dirname, "../../.env") });

// ENV configure data
const BASE_URL = process.env.BASE_URL;
const API_KEY = process.env.API_KEY;
const TOKEN = process.env.TOKEN;

// Axios Client Connection
const axiosClientService = axios.create({
    baseURL: BASE_URL,
    headers: {
        Authorization: `Bearer ${TOKEN}`,
        accept: "application/json",
    },
    params: {
        api_key: API_KEY,
    },
});

// // Axios Retry Connection Options
const axiosRetryOptions = {
    retries: 3, // 
    retryDelay: (retryCount: any) => {
        return retryCount * 1000;
    }, // Custom back-off retry delay between requests
    retryCondition: (error: any) => {
        // Retry only on specific errors (e.g., ECONNRESET or 5xx responses)
        return (
            axiosRetry.isNetworkError(error)
        );
    },
}

// // API Headers
// const headers = {
//     accept: 'application/json',
//     Authorization: `Bearer ${API_KEY}`
// };

axiosRetry(axiosClientService, axiosRetryOptions);

export default axiosClientService;