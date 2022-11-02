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
import Role from "./Role";
import DeleteRole from "./DeleteRole";

function Administrador() {
  const [roles, setRoles] = useState([]);
  const [alert, setAlert] = useState({
    open: false,
  });
  const [modalRole, setModalRole] = useState("");
  const [openModalDeleteRole, setOpenModalDeleteRole] = useState(false);
  const columns = [
    { Header: "Nombre", accessor: "nombre" },
    { Header: "Compuesto", accessor: "compuesto", align: "center" },
    { Header: "Descripción", accessor: "descripcion", width: "max-content" },
    { Header: "acciones", accessor: "actions", align: "center" },
  ];
  const [selectedRole, setSelectedRole] = useState({});

  const onClickEditRole = (role) => {
    setSelectedRole(role);
    setModalRole("edit");
  };

  const onClickDeleteRole = (role) => {
    setSelectedRole(role);
    setOpenModalDeleteRole(true);
  };

  const getRoles = () => {
    keycloakServerGet(
      "roles",
      null,
      (response) => {
        setRoles(
          response.data
            .map((role) => ({
              nombre: role.name,
              compuesto: role.composite ? (
                <Icon sx={{ color: "Gray" }} fontSize="medium">
                  done
                </Icon>
              ) : (
                <Icon sx={{ color: "Gray" }} fontSize="medium">
                  close
                </Icon>
              ),
              descripcion: role.description,
              actions: (
                <>
                  <MDButton variant="text" iconOnly>
                    <Icon sx={{ color: "Gray" }}>visibility</Icon>
                  </MDButton>
                  <MDButton variant="text" iconOnly onClick={() => onClickEditRole(role)}>
                    <Icon sx={{ color: "Gray" }}>edit</Icon>
                  </MDButton>
                  <MDButton variant="text" iconOnly onClick={() => onClickDeleteRole(role)}>
                    <Icon sx={{ color: "Gray" }}>delete</Icon>
                  </MDButton>
                </>
              ),
            }))
            .sort((a, b) => a.nombre.localeCompare(b.nombre))
        );
      },
      (error) => {
        setAlert({
          open: true,
          message: `No se pudo cargar los roles(${error.message})`,
          color: "error",
        });
      }
    );
  };

  useEffect(() => {
    getRoles();
  }, []);

  const handleCloseRole = (a = {}) => {
    setModalRole("");
    if (a !== {}) {
      setAlert(a);
      // Refrescamos la grilla al editar o modificar rol
      getRoles();
    }
  };

  const handleCloseDeleteRole = (a = {}) => {
    setOpenModalDeleteRole(false);
    if (a !== {}) {
      setAlert(a);
      // Refrescamos la grilla al eliminar rol
      getRoles();
    }
  };
  return (
    <DashboardLayout>
      <Modal
        title={modalRole === "add" ? "Crear Nuevo Rol" : "Editar Rol"}
        open={modalRole !== ""}
        handleClose={() => setModalRole("")}
      >
        <Role
          role={selectedRole}
          setAlert={setAlert}
          mode={modalRole}
          handleClose={handleCloseRole}
        />
      </Modal>
      <Modal
        title="Eliminar Rol"
        open={openModalDeleteRole}
        handleClose={() => setOpenModalDeleteRole(false)}
      >
        <DeleteRole role={selectedRole} setAlert={setAlert} handleClose={handleCloseDeleteRole} />
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
                  Roles
                </MDTypography>
                <MDButton
                  color="success"
                  variant="gradient"
                  size="large"
                  onClick={() => setModalRole("add")}
                >
                  <Icon>add</Icon>&nbsp; Crear nuevo
                </MDButton>
              </MDBox>
              {roles.length !== 0 ? (
                <MDBox pt={3}>
                  <DataTable
                    table={{ columns, rows: roles }}
                    isSorted={false}
                    noEndBorder
                    canSearch
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
