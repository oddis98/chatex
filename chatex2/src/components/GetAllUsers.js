import React, { useState, useEffect } from "react";
import { Grid, Typography } from "@material-ui/core";

function GetAllUsers() {
  const [users, setUsers] = useState(0);
  useEffect(() => {
    return getAllUsers();
  });

  const getAllUsers = () => {
    fetch("/users")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        let text = "";
        let i;
        for (i = 0; i < data["users"].length; i++) {
          text += data["users"][i].email + " ";
        }
        return setUsers(JSON.stringify(text));
      });
  };

  return (
    <Grid container align="center" id="main">
      <Grid item>
        <Typography variant="h3">All Users:</Typography>
        <Typography variant="h5">{users}</Typography>
      </Grid>
    </Grid>
  );
}

export default GetAllUsers;
