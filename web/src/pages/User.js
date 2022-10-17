// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

import Divider from "@mui/material/Divider";
import Switch from "@mui/material/Switch";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import { useEffect, useState } from "react";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import { keycloakServerGet, keycloakServerPost } from "services/CallApi";

function User({ username, handleClose, setAlert, mode }) {
  const [disabledSubmit, setDisableSubmit] = useState(true);
  const [user, setUser] = useState({
    username: "",
    firstName: "",
    lastName: "",
    enabled: true,
  });
  const [submitText, setSubmitText] = useState("Crear");

  useEffect(() => {
    if (mode === "update") {
      setSubmitText("Modificar");
      keycloakServerGet(
        `users?username=${username}`,
        null,
        (response) => {
          setUser(response.data[0]);
        },
        (error) => {
          setAlert({
            open: true,
            message: `No se pudo cargar datos del usuario ${username}(${error.message})`,
            color: "error",
          });
          console.error(error);
        }
      );
    } else if (mode === "add") {
      setSubmitText("Crear");
      setUser({
        username: "",
        firstName: "",
        lastName: "",
        enabled: true,
      });
    }
  }, [mode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "add") {
      keycloakServerPost(
        "users",
        user,
        () => {
          handleClose({
            open: true,
            color: "success",
            message: `Usuario creado correctamente`,
          });
        },
        (err) => {
          console.log(err);
          setAlert({
            open: true,
            color: "error",
            message: err.response.data.errorMessage,
          });
        }
      );
    }
  };

  const handleChange = (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setUser({ ...user, [event.target.name]: value });
    if (disabledSubmit) setDisableSubmit(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <MDBox display="flex" flexDirection="column" sx={{ width: "350px", maxWidth: "95vw" }}>
        <MDInput
          label="Usuario"
          name="username"
          value={user.username}
          onChange={handleChange}
          margin="dense"
        />
        <MDInput
          label="Nombre/s"
          name="firstName"
          value={user.firstName}
          onChange={handleChange}
          margin="dense"
        />
        <MDInput
          label="Apellido/s"
          name="lastName"
          value={user.lastName}
          onChange={handleChange}
          margin="dense"
        />
        <MDBox display="flex" alignItems="center">
          <Switch checked={user.enabled} onChange={handleChange} name="enabled" />
          <MDTypography variant="Body 2" color="text">
            Habilitado
          </MDTypography>
        </MDBox>
      </MDBox>
      <Divider />
      <MDBox display="flex" justifyContent="flex-end">
        <MDButton sx={{ marginRight: "1em" }} color="secondary" onClick={handleClose}>
          cancelar
        </MDButton>
        <MDButton
          variant="gradient"
          color="info"
          sx={{ marginRight: "0em" }}
          type="submit"
          disabled={disabledSubmit}
        >
          {submitText}
        </MDButton>
      </MDBox>
    </form>
  );
}

User.propTypes = {
  username: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
  mode: PropTypes.string.isRequired,
};

export default User;
