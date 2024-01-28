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
    let firstQueryArgument, secondQueryArgument;
    if (view === "Clients") {
        firstQueryArgument = "client_name";
        secondQueryArgument = "client_type";
    } else if (view === "Services") {
        firstQueryArgument = "service_point";
        secondQueryArgument = "client_name";
    } else if (view === "Pops") {
        firstQueryArgument = "pop_name";
        secondQueryArgument = "pop_owner";
    } else if (view === "Vendors") {
        firstQueryArgument = "vendor_name";
        secondQueryArgument = "vendor_type";
    }

    const firstRegex = new RegExp(`${firstQueryArgument}:([^ ]+)`, "i");
    const secondRegex = new RegExp(`${secondQueryArgument}:([^ ]+)`, "i");

    const firstMatch = searchString.match(firstRegex);
    const secondMatch = searchString.match(secondRegex);

    let queryParameters = "?";
    if (firstMatch) {
        queryParameters =
            queryParameters + firstQueryArgument + "=" + firstMatch[1];
    } else {
        queryParameters = queryParameters + firstQueryArgument + "=";
    }

    if (secondMatch) {
        queryParameters =
            queryParameters + "&" + secondQueryArgument + "=" + secondMatch[1];
    } else {
        queryParameters = queryParameters + "&" + secondQueryArgument + "=";
    }

    if (!firstMatch && !secondMatch) {
        queryParameters = "?" + firstQueryArgument + "=" + searchString;
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
            case "Vendors":
                apiEndpoint = apiEndpoint + "vendor";
                break;
            case "Pops":
                apiEndpoint = apiEndpoint + "pop";
                break;
            case "Addresses":
                apiEndpoint = apiEndpoint + "address";
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

    let base;
    if (action !== "search") {
        switch (view) {
            case "Clients":
                base = "client/";
                break;
            case "Service Types":
                base = "service/type/";
                break;
            case "Services":
                base = "service/";
                break;
            case "Vendors":
                base = "vendor/";
                break;
            case "Pops":
                base = "pop/";
                break;
            case "Addresses":
                base = "address/";
                break;
        }

        apiEndpoint = apiEndpoint + base + action;
        return apiEndpoint;
    }
};

export const isEqualObjects = (object1, object2) => {
    for (const key in object1) {
        if (object1[key] !== object2[key]) {
            return [false, "", ""];
        }
    }
    const message = "Nothing modified";
    const messageType = "Warning";
    return [true, message, messageType];
};

export const selectMethod = (action) => {
    let method;
    if (action === "add") {
        method = "POST";
    } else if (action === "modify") {
        method = "PUT";
    }
    return method;
};

export const createBody = (viewName, actionName, itemData) => {
    let body;
    if (viewName === "Services") {
        if (actionName === "add") {
            body = {
                client_id: itemData.clientId,
                point: itemData.point,
                service_type_id: itemData.serviceTypeId,
                bandwidth: itemData.bandwidth,
                pop_id: itemData.popId,
                extra_info: itemData.extraInfo,
            };
        }
    }
    return body;
};
