import axios from "axios";

/*Setting up interceptors with axios*/
axios.interceptors.request.use(function (config) {
    config.headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }

    if (isRequireToken(config.url)) {
        const authToken = localStorage.getItem('token');
        if (authToken) {
            config.headers['Authorization'] = `Bearer ${authToken}`;
            console.log("config heders in request", config.headers['Authorization'])
        }
    }
    return config;

}, function (error) {
    return Promise.reject(error);
})

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    console.log("response intercepters", response)
    return response;

}, function (error) {

    console.log('Error ::>', error);
    if (!error.response && error.message === 'Network Error') {
        return Promise.reject("Couldn't connect to server. Please try again later.");
    } else if (error.response && error.response.status === 401) { // Assuming 401 is the unauthorized status

    } else if (error.response && error.response.data) {
        return Promise.reject(error.response.data);
    } else {
        return Promise.reject("Server Connection Failed");
    }
});

export default class HTTP {
    static Request(method, url, data = null) {
        return new Promise((resolve, reject) => {
            const request = {
                method,
                url,
                [method.toUpperCase() === 'GET' ? "params" : "data"]: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            // Check if the request requires an authorization token
            if (isRequireToken(url)) {
                const authToken = localStorage.getItem('token');
                if (authToken) {
                    request.headers['Authorization'] = `Bearer ${authToken}`;
                }
            }
            axios(request)
                .then(response => resolve(response))
                .catch(error => {
                    if (error.errors) {
                        console.log(error.errors[0]);
                    } else {
                        console.log(error);
                    }
                    reject(error);
                });
        });
    }
}

function isRequireToken(url) {
    const PUBLIC_URLS = ["login", "register"];
    return !PUBLIC_URLS.some(publicUrl => url.includes(publicUrl));
}
