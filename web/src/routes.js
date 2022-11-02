import Icon from "@mui/material/Icon";
import Dashboard from "pages/Dashboard";
import Users from "pages/Users";
import Roles from "pages/Roles";

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
    type: "title",
    title: "Administrador",
    key: "administrador",
  },
  {
    type: "collapse",
    name: "Usuarios",
    key: "usuarios",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/administrador/usuarios",
    component: <Users />,
  },
  {
    type: "collapse",
    name: "Roles",
    key: "roles",
    icon: <Icon fontSize="small">manage_accounts</Icon>,
    route: "/administrador/roles",
    component: <Roles />,
  },
];

export default routes;
