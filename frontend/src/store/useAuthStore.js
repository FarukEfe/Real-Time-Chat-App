import {create} from "zustand";
import { axiosInstance } from "../api/axios.js";

// Zustand-provided global state-checking system. Is very helpful in constraining back-end relation under different states
// This is a reference-type object, meaning you access the same instance from any component when you import this.
export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    isCheckingAuth: true,
    checkAuth: async() => {
        try {
            const res = await axiosInstance.get("/auth/check");
            // Set parameter allows to update the state variables based on response in our useAuthStore object
            set({authUser: res.data})
        } catch (err) {
            console.log("error occured in checkAuth: " + err)
            set({authUser: null})
        }
        set({isCheckingAuth: false})
    }
}))