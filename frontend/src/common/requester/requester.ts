const BASE_URL = 'http://localhost:9001/api'

type MethodType = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type Payload = {
    headers: object;
    body?: string;
    method: MethodType;
}

function requester<T>(link: string, method: MethodType, payload?: T|object): Promise<Response> {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    const body = payload ? JSON.stringify(payload) : null;
    let data:Payload = {method, headers}

    if(body !== null) {
        data = {...data, body}
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return fetch(`${BASE_URL}${link}`, data)

}

export {requester};