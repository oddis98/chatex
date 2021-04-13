/* eslint-disable import/no-anonymous-default-export */
import React, { useEffect } from "react";
import { Formik } from "formik";
import LoginForm from "./LoginForm";
import LoginSchema from "./LoginSchema";
import { useHistory } from "react-router-dom";

export default (props) => {
  const handleSubmit = (values) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: values.email,
        password: values.password,
      }),
    };
    fetch("/users/email/" + values.email)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        try {
          const id = data["user"]["_id"];
          const email = data["user"]["email"];
          fetch("/login/" + id, requestOptions)
            .then((response) => response.json())
            .then((data) => {
              if (!data.success) {
                return alert(data.msg);
              }
              redirect(id, data.authorization, email);
            });
        } catch {
          alert("No user with that email");
        }
      });
  };

  const redirect = (id, auth, email) => {
    history.push("/chatex_client/users/" + id);
  };

  const history = useHistory();
  const create = () => {
    history.push({
      pathname: "/chatex_client/create",
    });
  };

  useEffect(() => {
    fetch("/login")
      .then((response) => response.json())
      .then((data) => {
        if (!data.success) {
          return;
        }
        history.push("/chatex_client/users/" + data.id);
      });
    return () => {};
  });

  const renderForm = () => {
    return (
      <div id="mainGrid">
        <h2>ChatEx</h2>
        <div className="signup">
          <Formik
            component={LoginForm}
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          />
          <button id="create" onClick={create}>
            Create Account
          </button>
        </div>
      </div>
    );
  };

  return renderForm();
};
