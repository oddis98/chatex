/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Form } from "formik";

export default ({ handleChange, values, errors, isValid }) => {
  return (
    <Form>
      <div>{errors.email}</div>
      <input
        type="email"
        onChange={handleChange}
        value={values.email}
        name="email"
        placeholder="Email"
      />
      <input
        type="password"
        onChange={handleChange}
        value={values.password}
        name="password"
        placeholder="Password"
      />
      <button disabled={!isValid}>Login</button>
    </Form>
  );
};
