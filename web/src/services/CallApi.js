import Axios from "axios";
import { updateToken } from "./UserService";

const httpClient = Axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export default httpClient;

export function getAccessToken() {
  return sessionStorage.getItem("token");
}

httpClient.interceptors.request.use((config) => {
  const cb = () => {
    const r = config;
    r.headers.Authorization = `Bearer ${getAccessToken()}`;
    return r;
  };
  return updateToken(cb);
});

const responseSuccessHandler = (response) => response;

const responseErrorHandler = (error) => {
  if (error.response && error.response.status === 401) {
    sessionStorage.removeItem("token");
    document.location.href = "/";
  }
  return Promise.reject(error);
};

httpClient.interceptors.response.use(
  (response) => responseSuccessHandler(response),
  (error) => responseErrorHandler(error)
);

export function setBaseURLToKeycloakServer() {
  if (
    httpClient.defaults.baseURL !==
    `${process.env.REACT_APP_AUTH_SERVER_URL}admin/realms/${process.env.REACT_APP_REALM}/`
  ) {
    httpClient.defaults.baseURL = `${process.env.REACT_APP_AUTH_SERVER_URL}admin/realms/${process.env.REACT_APP_REALM}/`;
  }
}

export function setBaseURLToAPIServer() {
  if (httpClient.defaults.baseURL !== process.env.REACT_APP_API_URL) {
    httpClient.defaults.baseURL = process.env.REACT_APP_API_URL;
  }
}

export function APIGet(endpoint, body, onSuccess, onError) {
  setBaseURLToAPIServer();
  httpClient
    .get(endpoint, body)
    .then((response) => {
      onSuccess(response);
    })
    .catch((error) => {
      onError(error);
    });
}

export function APIPost(endpoint, body, onSuccess, onError) {
  setBaseURLToAPIServer();
  httpClient
    .post(endpoint, body)
    .then((response) => {
      onSuccess(response);
    })
    .catch((error) => {
      onError(error);
    });
}

export function keycloakServerGet(endpoint, body, onSuccess, onError) {
  setBaseURLToKeycloakServer();
  httpClient
    .get(endpoint, body)
    .then((response) => {
      onSuccess(response);
    })
    .catch((error) => {
      onError(error);
    });
}

export function keycloakServerPost(endpoint, body, onSuccess, onError) {
  setBaseURLToKeycloakServer();
  httpClient
    .post(endpoint, body)
    .then((response) => {
      onSuccess(response);
    })
    .catch((error) => {
      onError(error);
    });
}

export function keycloakServerPut(endpoint, body, onSuccess, onError) {
  setBaseURLToKeycloakServer();
  httpClient
    .put(endpoint, body)
    .then((response) => {
      onSuccess(response);
    })
    .catch((error) => {
      onError(error);
    });
}

export function keycloakServerDelete(endpoint, body, onSuccess, onError) {
  setBaseURLToKeycloakServer();
  httpClient
    .delete(endpoint, body)
    .then((response) => {
      onSuccess(response);
    })
    .catch((error) => {
      onError(error);
    });
}
