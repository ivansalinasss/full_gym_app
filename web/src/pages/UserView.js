// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import { useState, useEffect } from "react";
import { keycloakServerGet } from "services/CallApi";

function UserView({ username, setAlert }) {
  const [user, setUser] = useState({});

  useEffect(() => {
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
  }, [username]);

  const parseDate = (miliseconds) => {
    const date = new Date(miliseconds);
    return date.toLocaleString();
  };

  return (
    <MDBox fixed>
      <MDBox key="emisor" display="flex" py={1} pr={2}>
        <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
          usuario: &nbsp;
        </MDTypography>
        <MDTypography variant="button" fontWeight="regular" color="text">
          &nbsp;{user.username}
        </MDTypography>
      </MDBox>
      <MDBox key="url" display="flex" py={1} pr={2}>
        <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
          Nombre y Apellido: &nbsp;
        </MDTypography>
        <MDTypography variant="button" fontWeight="regular" color="text">
          &nbsp;{user.firstName} {user.lastName}
        </MDTypography>
      </MDBox>
      <MDBox key="url" display="flex" py={1} pr={2}>
        <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
          Fecha y hora de creación: &nbsp;
        </MDTypography>
        <MDTypography variant="button" fontWeight="regular" color="text">
          &nbsp;{parseDate(user.createdTimestamp)}
        </MDTypography>
      </MDBox>
    </MDBox>
  );
}

UserView.propTypes = {
  username: PropTypes.string.isRequired,
  setAlert: PropTypes.func.isRequired,
};

export default UserView;
