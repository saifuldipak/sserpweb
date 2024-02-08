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
    let firstQueryArgument,
        secondQueryArgument,
        thirdQueryArgument,
        fourthQueryArgument;
    switch (view) {
        case "Clients":
            firstQueryArgument = "client_name";
            secondQueryArgument = "client_type";
            break;
        case "Services":
            firstQueryArgument = "service_point";
            secondQueryArgument = "client_name";
            break;
        case "Service Types":
            firstQueryArgument = "client_name";
            secondQueryArgument = "client_type";
            break;
        case "Pops":
            firstQueryArgument = "pop_name";
            secondQueryArgument = "pop_owner";
            break;
        case "Vendors":
            firstQueryArgument = "vendor_name";
            secondQueryArgument = "vendor_type";
            break;
        case "Addresses":
            firstQueryArgument = "client_name";
            secondQueryArgument = "service_point";
            thirdQueryArgument = "vendor_name";
            break;
        case "Contacts":
            firstQueryArgument = "contact_name";
            secondQueryArgument = "client_name";
            thirdQueryArgument = "service_point";
            fourthQueryArgument = "vendor_name";
            break;
    }

    const firstRegex = new RegExp(`${firstQueryArgument}:([^ ]+)`, "i");
    const secondRegex = new RegExp(`${secondQueryArgument}:([^ ]+)`, "i");
    const thirdRegex = new RegExp(`${thirdQueryArgument}:([^ ]+)`, "i");
    const fourthRegex = new RegExp(`${fourthQueryArgument}:([^ ]+)`, "i");

    const firstMatch = searchString.match(firstRegex);
    const secondMatch = searchString.match(secondRegex);
    const thirdMatch = searchString.match(thirdRegex);
    const fourthMatch = searchString.match(fourthRegex);

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

    if (thirdMatch) {
        queryParameters =
            queryParameters + "&" + thirdQueryArgument + "=" + thirdMatch[1];
    } else {
        queryParameters = queryParameters + "&" + thirdQueryArgument + "=";
    }

    if (fourthMatch) {
        queryParameters =
            queryParameters + "&" + fourthQueryArgument + "=" + fourthMatch[1];
    } else {
        queryParameters = queryParameters + "&" + fourthQueryArgument + "=";
    }

    if (!firstMatch && !secondMatch && !thirdMatch && !fourthMatch) {
        queryParameters = "?" + firstQueryArgument + "=" + searchString;
    }

    return queryParameters;
};

//create api url for different types of views('Clients' , 'Services' etc.) and
//actions('search', 'add', 'modify' etc.)
export const createApiUrl = ({ view, action = "", searchString = "" }) => {
    if (action) {
        const actionNames = ["search", "Add", "Modify", "Delete"];
        let match = false;
        for (const item of actionNames) {
            if (action === item) {
                match = true;
                break;
            }
        }

        if (!match) {
            throw new Error(`Unknown action: ${action}`);
        }
    }

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
            case "Contacts":
                apiEndpoint = apiEndpoint + "contact";
                break;
            default:
                throw new Error("Unknown view");
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
            case "Contacts":
                base = "contact/";
                break;
            default:
                throw new Error("Unknown view");
        }

        apiEndpoint = apiEndpoint + base + action.toLowerCase();
        return apiEndpoint;
    }
};

export const isEqualObjects = (object1, object2) => {
    for (const key in object1) {
        if (object1[key] !== object2[key]) {
            return false;
        }
    }
    return true;
};

/* export const selectMethod = (action) => {
    let method;
    if (action === "Add") {
        method = "POST";
    } else if (action === "Modify") {
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
    } else if (viewName === "Clients") {
        if (actionName === "Add") {
            body = {
                name: itemData.name,
                client_type_id: itemData.clientTypeId,
            };
        } else if (actionName === "Modify") {
            body = {
                id: itemData.id,
                name: itemData.name,
                client_type_id: itemData.clientTypeId,
            };
        }
    }

    return body;
};
 */
