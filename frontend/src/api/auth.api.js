import { authClient } from './axios.js';

export const loginRequest = (data) => authClient.post('/auth/login', data);
export const registerRequest = (data) => authClient.post('/auth/register', data);
export const profileRequest = () => authClient.get('/auth/profile');
export const usersCountRequest = () => authClient.get('/auth/users/count');
export const usersListRequest = () => authClient.get('/auth/users');
