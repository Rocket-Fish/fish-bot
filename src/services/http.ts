import axios from 'axios';

const instance = axios.create({
    headers: {
        'Content-Type': 'application/json; charset=UTF-8',
    },
});

instance.interceptors.request.use((x) => {
    console.log(
        `${new Date()} | AXIOS:${x.method?.toUpperCase()} | ${
            x.url
        } | ${JSON.stringify(x.data)}`
    );
    return x;
});

export default instance;
