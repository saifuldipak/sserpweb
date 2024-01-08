export const API_URL = "http://127.0.0.1:8000/";

//create request json object for api call
export const createRequest = function (method, body = "") {
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

//make api call & return response code and data
export const callApi = async (apiEndpoint, request) => {
    const result = { code: "", response: "", error: "" };

    try {
        const response = await fetch(apiEndpoint, request);
        result.code = response.status;
        result.response = await response.json();
    } catch (error) {
        console.error(error);
        result.error = error.message;
    }

    return result;
};

//create query parameters
export const createQueryParameters = (view, searchString) => {
    let queryParameters, clientName, clientType, servicePoint;
    const searchStringLowerCase = searchString.toLowerCase();

    const clientNameRegex = /client_name:([^ ]+)/;
    const clientNameMatch = clientNameRegex.exec(searchStringLowerCase);
    if (clientNameMatch) {
        clientName = clientNameMatch[1];
    } else {
        clientName = "";
    }

    if (view === "Clients") {
        const clientTypeRegex = /client_type:([^ ]+)/;
        const clientTypeMatch = clientTypeRegex.exec(searchStringLowerCase);

        if (clientTypeMatch) {
            clientType = clientTypeMatch[1];
        } else {
            clientType = "";
        }

        if (!clientNameMatch && !clientTypeMatch) {
            clientName = searchStringLowerCase;
            clientType = "";
        }

        queryParameters = `?client_name=${clientName}&client_type=${clientType}`;
    } else if (view === "Services") {
        const servicePointRegex = /service_point:([^ ]+)/;
        const servicePointMatch = servicePointRegex.exec(searchStringLowerCase);
        if (servicePointMatch) {
            servicePoint = servicePointMatch[1];
        } else {
            servicePoint = "";
        }

        if (!clientNameMatch && !servicePointMatch) {
            servicePoint = searchStringLowerCase;
            clientName = "";
        }

        queryParameters = `?service_point=${servicePoint}&client_name=${clientName}`;
    }

    return queryParameters;
};

//search
export const createApiUrl = (view, searchString = "") => {
    let apiEndpoint;

    if (view == "Clients") {
        const queryParameters = createQueryParameters(view, searchString);
        apiEndpoint = API_HOST + "search/client" + queryParameters;
    } else if (view == "Services") {
        const queryParameters = createQueryParameters(view, searchString.value);
        apiEndpoint = API_HOST + "search/service" + queryParameters;
    } else if (view == "Service Types") {
        apiEndpoint = API_HOST + "search/service/type";
    } else if (view == "Client Types") {
        apiEndpoint = API_HOST + "search/client/type";
    }

    return apiEndpoint;
};
