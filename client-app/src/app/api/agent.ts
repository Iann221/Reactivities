import axios, { AxiosError, AxiosResponse } from 'axios';
import { request } from 'http';
import { toast } from 'react-toastify';
import { Activity } from '../models/activity';
import { User, UserFormValues } from '../models/user';
import { router } from '../router/Routes';
import { store } from '../stores/store';

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.request.use(config => { //apa yang dilakukan saat api request
    const token = store.commonStore.token;
    if(token && config.headers) config.headers.Authorization = `Bearer ${token}`;
    return config;
}) 

axios.interceptors.response.use(async response => { // interceptor: apa yg dilakukan klo api selesai
        await sleep(1000);
        return response;
}, (error: AxiosError) => { // setelah koma, itu deals when a request is rejected
    const {data, status, config} = error.response as AxiosResponse;
    switch (status) {
        case 400:
            if (config.method === 'get' && data.errors.hasOwnProperty('id')){
                router.navigate('/not-found');
            }
            if (data.errors) {
                const modalStateErrors = [];
                for (const key in data.errors){
                    if (data.errors[key]){
                        modalStateErrors.push(data.errors[key]);
                    }
                }
                throw modalStateErrors.flat(); // ngirim jadi
            } else {
                toast.error(data); // kalo 400 doang tanpa data2 errors
            }
            break;
        case 401:
            toast.error('unauthorized')
            break;
        case 403:
            toast.error('forbidden')
            break;
        case 404:
            toast.error('not found')
            router.navigate('/not-found')
            break;
        case 500:
            toast.error('server error')
            store.commonStore.setServerError(data);
            router.navigate('/server-error')
            break;
        default:
            break;
    }
    return Promise.reject(error);
}) 

const responseBody = <T> (response: AxiosResponse<T>) => response.data; // return response.datanya

const requests = {
    get: <T> (url: string) => axios.get<T>(url).then(responseBody),
    post: <T> (url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T> (url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T> (url: string) => axios.delete<T>(url).then(responseBody),
}

// method2 api
const Activities = {
    list: () => requests.get<Activity[]>('/activities'),
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: Activity) => requests.post('/activities',activity),
    update: (activity: Activity) => requests.put(`/activities/${activity.id}`,activity),
    delete: (id: string) => requests.del(`/activities/${id}`)
}

// method2 api login
const Account = {
    current: () => requests.get<User>('/account'),
    login: (user: UserFormValues) => requests.post<User>('/account/login', user),
    register: (user: UserFormValues) => requests.post<User>('/account/register', user)
}

const agent  = {
    Activities,
    Account
}

export default agent;