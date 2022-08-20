import Keycloak from "keycloak-js";

const keycloackConfig = {
  realm: process.env.REACT_APP_REALM,
  url: process.env.REACT_APP_AUTH_SERVER_URL,
  clientId: process.env.REACT_APP_RESOURCE,
};

const keycloak = new Keycloak(keycloackConfig);

export const initKeycloak = (onAuthenticatedCallback) => {
  keycloak.init({ onLoad: "login-required", checkLoginIframe: false }).then((authenticated) => {
    if (authenticated) {
      sessionStorage.setItem("token", keycloak.token !== undefined ? keycloak.token : "");
      onAuthenticatedCallback();
    } else {
      console.warn("¡No fue posible autenticar!");
      keycloak.login();
    }
  });
};

export const doLogin = keycloak.login;

export const doLogout = keycloak.logout;

export const getToken = () => keycloak.token;

export const updateToken = (successCallback) =>
  keycloak.updateToken(5).then(successCallback).catch(doLogin);

export const getUsername = () => keycloak.tokenParsed?.preferred_username;

export const getFullname = () => `${keycloak.tokenParsed?.given_name}`;

export const hasRole = (roles) => roles.some((role) => keycloak.hasRealmRole(role));
