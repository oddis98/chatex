/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import "../LandingPage.css";

import Grid from "@material-ui/core/Grid";

import Login from "./Login/Login";

export default () => {
  return (
    <Grid container>
      <Grid item xs={12} align="center">
        <Login />
      </Grid>
    </Grid>
  );
};
