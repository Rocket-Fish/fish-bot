import axios from 'axios';

const instance = axios.create({
    headers: {
        'Content-Type': 'application/json; charset=UTF-8',
    },
});

instance.interceptors.request.use((r) => {
    console.log(`${new Date()} | AXIOS:${r.method?.toUpperCase()} | ${r.url} | ${JSON.stringify(r.data)}`);
    return r;
});

instance.interceptors.response.use(
    (r) => r,
    (err) => {
        throw new HTTPError(err.response?.config?.url || '<unavailable URL>', err.code, err.message, err.response?.status, err.response?.data);
    }
);

export class HTTPError extends Error {
    url: string | undefined;
    code: string | undefined;
    data: any | undefined;
    status: number | undefined;
    constructor(url: string, message: string, code: string, status: number, data?: any) {
        super();
        this.name = 'HTTPError';
        this.url = url;
        this.status = status;
        this.code = code;
        this.message = message;
        this.data = data;
    }
}

export default instance;
