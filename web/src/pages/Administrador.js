import DashboardLayout from "components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "layouts/Navbar";
import Footer from "layouts/Footer";
import DataTable from "layouts/DataTable";
import Modal from "layouts/Modal";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import { keycloakServerGet } from "services/CallApi";
import React, { useState, useEffect } from "react";
import UserView from "./UserView";

function Administrador() {
  const [users, setUsers] = useState([]);
  const [alert, setAlert] = useState({
    open: false,
  });
  const columns = [
    { Header: "Usuario", accessor: "user" },
    { Header: "Nombre", accessor: "nombreCompleto", width: "max-content" },
    { Header: "Enabled", accessor: "enabled" },
    { Header: "acciones", accessor: "actions" },
  ];
  const [openModalUserView, setOpenModalUserView] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");

  const onClickUserView = (username) => {
    setSelectedUser(username);
    setOpenModalUserView(true);
  };

  const getUsers = () => {
    keycloakServerGet(
      "users",
      null,
      (response) => {
        setUsers(
          response.data.map((user) => ({
            user: user.username,
            nombreCompleto: `${user.firstName} ${user.lastName}`,
            enabled: user.enabled ? (
              <Icon sx={{ color: "Gray" }} fontSize="medium">
                done
              </Icon>
            ) : (
              <Icon sx={{ color: "Gray" }}>toggle_off</Icon>
            ),
            actions: (
              <MDButton variant="text" iconOnly onClick={() => onClickUserView(user.username)}>
                <Icon sx={{ color: "Gray" }}>visibility</Icon>
              </MDButton>
            ),
          }))
        );
      },
      (error) => {
        setAlert({
          open: true,
          message: `No se pudo cargar los usuarios(${error.message})`,
          color: "error",
        });
        console.error(error);
      }
    );
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <DashboardLayout>
      <Modal
        title="Detalle del Usuario"
        open={openModalUserView}
        handleClose={() => setOpenModalUserView(false)}
      >
        <UserView username={selectedUser} setAlert={setAlert} />
      </Modal>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  Usuarios
                </MDTypography>
                <MDButton color="success" variant="gradient" size="large">
                  <Icon>add</Icon>&nbsp; Crear nuevo
                </MDButton>
              </MDBox>
              {users.length !== 0 ? (
                <MDBox pt={3}>
                  <DataTable
                    table={{ columns, rows: users }}
                    isSorted={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                </MDBox>
              ) : (
                <MDBox p={2} />
              )}
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <MDSnackbar
        color={alert.color}
        title={alert.message}
        open={alert.open}
        icon={alert.color === "success" ? "check" : "warning"}
        onClose={() => setAlert({ ...alert, open: false })}
        close={() => setAlert({ ...alert, open: false })}
      />
      <Footer />
    </DashboardLayout>
  );
}

export default Administrador;
