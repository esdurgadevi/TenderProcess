import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api/accounts";

// REGISTER
export const registerUser = async (userData) => {

    try {
        const response = await axios.post(
            `${BASE_URL}/register/`,
            userData
        );
        return response.data;

    } catch (error) {

        throw error.response.data;
    }
};

// LOGIN
export const loginUser = async (loginData) => {

    try {

        const response = await axios.post(
            `${BASE_URL}/login/`,
            loginData
        );

        // STORE TOKEN
        localStorage.setItem(
            "token",
            response.data.access
        );

        return response.data;

    } catch (error) {

        throw error.response.data;
    }
};

// LOGOUT
export const logoutUser = () => {

    localStorage.removeItem("token");
};

// GET TOKEN
export const getToken = () => {

    return localStorage.getItem("token");
};

// CHECK LOGIN
export const isAuthenticated = () => {

    return !!localStorage.getItem("token");
};