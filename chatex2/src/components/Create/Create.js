/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Formik } from "formik";
import CreateForm from "./CreateForm";
import CreateSchema from "./CreateSchema";
import { useHistory } from "react-router-dom";
import { Typography } from "@material-ui/core";

const bcrypt = require("bcryptjs");

export default (props) => {
  const createUser = (email, password) => {
    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync());
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.toLowerCase(),
        password: hashedPassword,
      }),
    };
    fetch("/users", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (!data.success) {
          return alert(data.msg);
        }
        alert("User: " + data.user.email + " created successfully!");
      });
  };

  const handleSubmit = (values) => {
    const email = values.email;
    const password = values.password;
    createUser(email, password);
  };

  const history = useHistory();
  const back = () => {
    history.push({
      pathname: "/home",
    });
  };
  return (
    <div id="mainGrid">
      <Typography variant="h1">Create an Account</Typography>
      <div className="signup">
        <Formik
          component={CreateForm}
          initialValues={{ email: "", password: "" }}
          validationSchema={CreateSchema}
          onSubmit={handleSubmit}
        />
        <button id="cancel" onClick={back}>
          Cancel
        </button>
      </div>
    </div>
  );
};
