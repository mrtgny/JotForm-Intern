export function fetchQueryResult(payload) {
    const { path, params, postAction } = payload;
    fetch(
        "http://localhost:8000/api/" + path,
        {
            method: params ? "POST" : 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: params ? JSON.stringify(params) : undefined
        }
    ).then(function (response) {
        return response.json();
    }).then(data => {
        if (postAction)
            postAction(data);
        window.data = data;
    })

}

export function upsertForm(payload) {
    const { path, params, pk, postAction, data } = payload;
    const method = pk ? "update" : "create"
    fetch(
        "http://localhost:8000/api/" + path + "/" + method,
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data, ...(params || {}) })
        }
    ).then(function (response) {
        return response.text();
    }).then(data => {
        if (postAction)
            postAction(data)
        window.data = data;
    })

}