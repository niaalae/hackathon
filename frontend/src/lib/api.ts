import axios from "axios";

if(!import.meta.env.VITE_PUBLIC_API_URL)throw new Error("VITE_PUBLIC_API_URL isn't defined")

const api = axios.create({
    baseURL:import.meta.env.VITE_PUBLIC_API_URL,
})

export default api