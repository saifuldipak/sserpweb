export const API_URL = "http://127.0.0.1:8000/";

export const createRequestBody = function (method, body = "") {
    const token = localStorage.getItem("token");
    if (!token) {
        console.log("JWT not found in local storage");
        emit("auth-required");
    }

    let request;
    if (body) {
        request = {
            method: method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        };
    } else {
        request = {
            method: method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };
    }
    return request;
};
