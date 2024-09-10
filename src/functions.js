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
    let firstQueryArgument, secondQueryArgument, thirdQueryArgument, fourthQueryArgument;
    switch (view) {
        case "Clients":
            firstQueryArgument = "client_id";
            secondQueryArgument = "client_name";
            thirdQueryArgument = "client_type";
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
        case "Account Managers":
            firstQueryArgument = "contact_name";
            secondQueryArgument = "client_name";
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
        queryParameters = queryParameters + firstQueryArgument + "=" + firstMatch[1];
    } else {
        queryParameters = queryParameters + firstQueryArgument + "=";
    }

    if (secondMatch) {
        queryParameters = queryParameters + "&" + secondQueryArgument + "=" + secondMatch[1];
    } else {
        queryParameters = queryParameters + "&" + secondQueryArgument + "=";
    }

    if (thirdMatch) {
        queryParameters = queryParameters + "&" + thirdQueryArgument + "=" + thirdMatch[1];
    } else {
        queryParameters = queryParameters + "&" + thirdQueryArgument + "=";
    }

    if (fourthMatch) {
        queryParameters = queryParameters + "&" + fourthQueryArgument + "=" + fourthMatch[1];
    } else {
        queryParameters = queryParameters + "&" + fourthQueryArgument + "=";
    }

    if (!firstMatch && !secondMatch && !thirdMatch && !fourthMatch) {
        queryParameters = "?" + firstQueryArgument + "=" + searchString;
    }

    queryParameters = queryParameters + "&" + "page=0" + "&" + "page_size=20";
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
        apiEndpoint = apiEndpoint + "/token";
        return apiEndpoint;
    }

    if (action === "search") {
        switch (view) {
            case "Clients":
                apiEndpoint = apiEndpoint + "/clients";
                break;
            case "Services":
                apiEndpoint = apiEndpoint + "/services";
                break;
            case "Client Types":
                apiEndpoint = apiEndpoint + "/client/types";
                break;
            case "Service Types":
                apiEndpoint = apiEndpoint + "/service/types";
                break;
            case "Vendors":
                apiEndpoint = apiEndpoint + "/vendors";
                break;
            case "Pops":
                apiEndpoint = apiEndpoint + "/pops";
                break;
            case "Addresses":
                apiEndpoint = apiEndpoint + "/addresses";
                break;
            case "Contacts":
                apiEndpoint = apiEndpoint + "/contacts";
                break;
            case "Account Managers":
                apiEndpoint = apiEndpoint + "/account_managers";
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

    let resource;
    if (action !== "search") {
        switch (view) {
            case "Clients":
                resource = "/client";
                break;
            case "Service Types":
                resource = "/service/type";
                break;
            case "Services":
                resource = "/service";
                break;
            case "Vendors":
                resource = "/vendor";
                break;
            case "Pops":
                resource = "/pop";
                break;
            case "Addresses":
                resource = "/address";
                break;
            case "Contacts":
                resource = "/contact";
                break;
            case "Account Managers":
                resource = "/account_manager";
                break;
            case "Client Types":
                resource = "/client/type";
                break;
            default:
                throw new Error("Unknown view");
        }

        apiEndpoint = apiEndpoint + resource;
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

export const createNotificationMessage = (viewName, actionName) => {
    let item = "";
    if (viewName === "Client Types") {
        item = "Client type";
    } else if (viewName === "Clients") {
        item = "Client";
    } else if (viewName === "Vendors") {
        item = "Vendor";
    } else if (viewName === "Services") {
        item = "Service";
    } else if (viewName === "Pops") {
        item = "Pop";
    } else if (viewName === "Addresses") {
        item = "Address";
    } else if (viewName === "Contacts") {
        item = "Contact";
    } else if (viewName === "Service Types") {
        item = "Service type";
    }

    if (actionName === "Add") {
        return `${item} added successfully`;
    } else if (actionName === "Modify") {
        return `${item} modified successfully`;
    } else if (actionName === "Delete") {
        return `${item} deleted successfully`;
    }
};

export const resetFormData = (formData) => {
    for (const key in formData) {
        if (typeof formData[key] === "object" && formData[key] !== null) {
            resetFormData(formData[key]); // Recursively reset nested objects
        } else if (typeof formData[key] === "string") {
            formData[key] = "";
        } else if (typeof formData[key] === "number") {
            formData[key] = 0;
        }
    }
};
