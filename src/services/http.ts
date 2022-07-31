import axios from 'axios';

const instance = axios.create({
    headers: {
        'Content-Type': 'application/json; charset=UTF-8',
    },
});

instance.interceptors.request.use((r) => {
    console.log(
        `${new Date()} | AXIOS:${r.method?.toUpperCase()} | ${
            r.url
        } | ${JSON.stringify(r.data)}`
    );
    return r;
});

instance.interceptors.response.use(
    (r) => r,
    (err) => {
        throw new HTTPError(
            err.request?.url || '<unavailable URL>',
            err.code,
            err.message,
            err.response?.data
        );
    }
);

export class HTTPError extends Error {
    url: string | undefined;
    code: string | undefined;
    data: any | undefined;
    constructor(url: string, code: string, message: string, data?: any) {
        super();
        this.url = url;
        this.code = code;
        this.message = message;
        this.data = data;
    }
}

export default instance;
