import React from "react";
import { Grid } from "@material-ui/core";
import Create from "./Create/Create";

function CreateUser() {
  return (
    <Grid container>
      <Grid item xs={12} align="center">
        <Create />
      </Grid>
    </Grid>
  );
}

export default CreateUser;
