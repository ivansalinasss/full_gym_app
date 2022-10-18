// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

import Divider from "@mui/material/Divider";
import Switch from "@mui/material/Switch";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import { useEffect, useState } from "react";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import { keycloakServerPost, keycloakServerPut } from "services/CallApi";

function User({ user, handleClose, setAlert, mode }) {
  const [disabledSubmit, setDisableSubmit] = useState(true);
  const [state, setState] = useState({
    username: "",
    firstName: "",
    lastName: "",
    enabled: true,
  });
  const [submitText, setSubmitText] = useState("Crear");

  useEffect(() => {
    setDisableSubmit(true);
    if (mode === "edit") {
      setSubmitText("Modificar");
      setState(user);
    } else if (mode === "add") {
      setSubmitText("Crear");
      setState({
        username: "",
        firstName: "",
        lastName: "",
        enabled: true,
      });
    }
  }, [mode, user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "add") {
      keycloakServerPost(
        "users",
        state,
        () => {
          handleClose({
            open: true,
            color: "success",
            message: `Usuario creado correctamente`,
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
    } else if (mode === "edit") {
      keycloakServerPut(
        `users/${state.id}`,
        state,
        () => {
          handleClose({
            open: true,
            color: "success",
            message: `Usuario ${state.username} modificado correctamente`,
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
    }
  };

  const handleChange = (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setState({ ...user, [event.target.name]: value });
    if (disabledSubmit) setDisableSubmit(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <MDBox display="flex" flexDirection="column" sx={{ width: "350px", maxWidth: "95vw" }}>
        <MDInput
          label="Usuario"
          name="username"
          value={state.username}
          onChange={handleChange}
          margin="dense"
          disabled={mode === "edit"}
        />
        <MDInput
          label="Nombre/s"
          name="firstName"
          value={state.firstName}
          onChange={handleChange}
          margin="dense"
        />
        <MDInput
          label="Apellido/s"
          name="lastName"
          value={state.lastName}
          onChange={handleChange}
          margin="dense"
        />
        <MDBox display="flex" alignItems="center">
          <Switch checked={state.enabled} onChange={handleChange} name="enabled" />
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
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    enabled: PropTypes.bool.isRequired,
    createdTimestamp: PropTypes.shape().isRequired,
  }).isRequired,
  handleClose: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
  mode: PropTypes.string.isRequired,
};

export default User;
