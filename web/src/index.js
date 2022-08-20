import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "App";
import { initKeycloak } from "services/UserService";

// Material Dashboard 2 React Context Provider
import { MaterialUIControllerProvider } from "context";

const renderApp = () => {
  ReactDOM.render(
    <BrowserRouter>
      <MaterialUIControllerProvider>
        <App />
      </MaterialUIControllerProvider>
    </BrowserRouter>,
    document.getElementById("root")
  );
};

initKeycloak(renderApp);
