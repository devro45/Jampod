import { enqueueSnackbar } from "notistack";
import { IActivate, ICreateRoom, IEmail, IVerifyOTP } from "../types";
import axios from "axios";


const api = axios.create({
    baseURL : "https://jampod-backend.onrender.com",
    withCredentials: true,
    headers : {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    }
})

// List of All Endpoints
export const sendOtp = (data: IEmail) => api.post("/api/v1/send-otp", data);
export const verifyOtp = (data: IVerifyOTP) => api.post("/api/v1/verify-otp", data);
export const activate = (data: IActivate) => api.post("/api/v1/activate", data);
export const logout = () => api.post('/api/v1/logout');
export const createRoom = (data: ICreateRoom) => api.post("/api/v1/rooms", data);
export const getAllRooms = () => api.get("/api/v1/rooms");
export const getRoom = (data: string | undefined) => api.get(`/api/v1/rooms/${data}`);
export const getUser = (data: string | undefined) => api.get(`/api/v1/user/${data}`); 
export const getUserSpecificRoom = (data: string | undefined) => api.get(`/api/v1/user/${data}/rooms`);

// Interceptors

api.interceptors.response.use((config:any) => {
    return config;
}, async (error:any) => {
    const originalRequest = error.config;
    if(error.response.status === 401 && originalRequest && !originalRequest._isRetry) {
        originalRequest.isRetry = true;

        try {
            await axios.get(`https://jampod-backend.onrender.com/api/v1/refresh`, {
                withCredentials : true,
            });

            return api.request(originalRequest);

        } catch (error:any) {
            enqueueSnackbar(error.response.data.message, {
                variant: "error"
            })
        }
    }

    throw error;
})


export default api;