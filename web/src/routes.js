import Icon from "@mui/material/Icon";
import Dashboard from "pages/Dashboard";
import Administrador from "pages/Administrador";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">home</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Administrador",
    key: "administrador",
    icon: <Icon fontSize="small">admin_panel_settings</Icon>,
    route: "/administrador",
    component: <Administrador />,
  },
];

export default routes;
