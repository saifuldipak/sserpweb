import { API_HOST } from "./config";

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

//create api url for different types of views('Clients' , 'Services' etc.) and
//actions('search', 'add', 'modify' etc.)
export const createApiUrl = ({ view, action = "", searchString = "" }) => {
    let apiEndpoint = API_HOST;

    if (view === "token") {
        apiEndpoint = apiEndpoint + "token";
        return apiEndpoint;
    }

    if (action === "search") {
        apiEndpoint = apiEndpoint + "search/";
        switch (view) {
            case "Clients":
                apiEndpoint = apiEndpoint + "client";
                break;
            case "Services":
                apiEndpoint = apiEndpoint + "service";
                break;
            case "Client Types":
                apiEndpoint = apiEndpoint + "client/type";
                break;
            case "Service Types":
                apiEndpoint = apiEndpoint + "service/type";
                break;
            default:
                throw new Error("Unknown view for action 'search'");
        }

        if (searchString) {
            const queryParameters = createQueryParameters(view, searchString);
            apiEndpoint = apiEndpoint + queryParameters;
        }

        return apiEndpoint;
    }

    if (view === "Clients" && action !== "search") {
        apiEndpoint = apiEndpoint + "client/";
        switch (action) {
            case "add":
                apiEndpoint = apiEndpoint + "add";
                break;
            case "modify":
                apiEndpoint = apiEndpoint + "modify";
                break;
            case "delete":
                apiEndpoint = apiEndpoint + "delete";
                break;
            default:
                throw new Error("Unknow action for view 'Clients'");
        }
        return apiEndpoint;
    }
};
