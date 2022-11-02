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

function Role({ role, handleClose, setAlert, mode }) {
  const [disabledSubmit, setDisableSubmit] = useState(true);
  const [state, setState] = useState({
    name: "",
    description: "",
    composite: false,
  });
  const [submitText, setSubmitText] = useState("Crear");

  useEffect(() => {
    setDisableSubmit(true);
    if (mode === "edit") {
      setSubmitText("Editar");
      setState(role);
    } else if (mode === "add") {
      setSubmitText("Crear");
      setState({
        name: "",
        description: "",
      });
    }
  }, [mode, role]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "add") {
      keycloakServerPost(
        "roles",
        state,
        () => {
          handleClose({
            open: true,
            color: "success",
            message: `Rol creado correctamente`,
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
        `roles/${state.name}`,
        state,
        () => {
          handleClose({
            open: true,
            color: "success",
            message: `Rol ${state.username} modificado correctamente`,
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
    setState({ ...state, [event.target.name]: value });
    if (disabledSubmit) setDisableSubmit(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <MDBox display="flex" flexDirection="column" sx={{ width: "350px", maxWidth: "95vw" }}>
        <MDInput
          label="Nombre de rol"
          name="name"
          value={state.name}
          onChange={handleChange}
          margin="dense"
          disabled={mode === "edit"}
        />
        <MDInput
          label="Descripción"
          name="description"
          value={state.description}
          onChange={handleChange}
          margin="dense"
          multiline
          rows={4}
        />
        {mode === "edit" ? (
          <MDBox display="flex" alignItems="center">
            <Switch checked={state.composite} onChange={handleChange} name="composite" />
            <MDTypography variant="Body 2" color="text">
              Compuesto
            </MDTypography>
          </MDBox>
        ) : null}
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

Role.propTypes = {
  role: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    composite: PropTypes.bool.isRequired,
  }).isRequired,
  handleClose: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
  mode: PropTypes.string.isRequired,
};

export default Role;
