// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

import Divider from "@mui/material/Divider";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { keycloakServerDelete } from "services/CallApi";

function DeleteRole({ role, handleClose, setAlert }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    keycloakServerDelete(
      `roles/${role.name}`,
      null,
      () => {
        handleClose({
          open: true,
          color: "success",
          message: `Rol ${role.name} eliminado correctamente`,
        });
      },
      (err) => {
        setAlert({
          open: true,
          color: "error",
          message: err.response.data.errorMessage,
        });
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <MDBox display="flex" flexDirection="column" sx={{ width: "350px", maxWidth: "95vw" }}>
        <MDTypography variant="Body 2" color="text">
          Desea eliminar el rol {role.name}?
        </MDTypography>
      </MDBox>
      <Divider />
      <MDBox display="flex" justifyContent="flex-end">
        <MDButton sx={{ marginRight: "1em" }} color="secondary" onClick={handleClose}>
          cancelar
        </MDButton>
        <MDButton variant="gradient" color="info" sx={{ marginRight: "0em" }} type="submit">
          Eliminar
        </MDButton>
      </MDBox>
    </form>
  );
}

DeleteRole.propTypes = {
  role: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    composite: PropTypes.bool.isRequired,
  }).isRequired,
  handleClose: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
};

export default DeleteRole;
