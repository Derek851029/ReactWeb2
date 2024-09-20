
const apis = () => {
    const environment = process.env.NODE_ENV;
    console.log(environment)
    let apiUrl;

    if (environment === 'development') {
        apiUrl = process.env.REACT_APP_DEV_API_URL;
    } else if (environment === 'production') {
        apiUrl = process.env.REACT_APP_PROD_API_URL;
    } else {
        apiUrl = process.env.REACT_APP_UAT_API_URL;
    }

    return apiUrl
}

const get = (api) => {
    const url = apis()

    return fetch(`${url}${api}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
}

const post = (api, data) => {
    const url = apis()

    return fetch(`${url}${api}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: data
    })
}

export {get,post }