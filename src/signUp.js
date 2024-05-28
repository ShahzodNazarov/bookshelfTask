import VisibilityIcon from "@mui/icons-material/Visibility";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import uuid from "react-uuid";
import axios from "axios";

function SignUp() {
  let [checkMatchPassword, setCheckMatchPassword] = useState(false);
  const [textOrPassword, setTextOrpassword] = useState(false);
  const navigate = useNavigate();

  function resetForm() {
    document.getElementById("form").reset();
  }

  function navigateToLogin(params) {
    navigate("/logIn");
  }

  const { mutate } = useMutation({
    mutationFn: (value) => {
      return axios.post("http://165.73.244.77:3000/users", value);
    },
    onSuccess: () => {
      console.log("success post");
    },
    onError: () => {
      console.log("error");
    },
  });

  function submit(event) {
    event.preventDefault();
    let password = event.target[2].value;
    let confirmPassword = event.target[4].value;

    if (password == confirmPassword) {
      let createUserObject = {
      name: event.target[0].value,
      email: event.target[1].value,
      password: event.target[2].value,
      id: uuid() };
      localStorage.setItem("name", event.target[0].value);
      mutate(createUserObject);
      setCheckMatchPassword(false);
      resetForm();
      navigate("/login");
    } else {
      setCheckMatchPassword(true);
    }
  }

  return (
    <div className="container">

      <div className="row">
        <form onSubmit={submit} id="form">
          <h2>create user</h2>

          <label htmlFor="username">username</label>
          <input
            required
            type="text"
            className="form-control"
            id="username"
            placeholder="enter a user name "
          />

          <label htmlFor="email">Email</label>
          <input
            required
            type="email"
            className="form-control"
            id="email"
            placeholder="enter the Email address"
          />

          <label htmlFor="password">password</label>
          <input
            required
            type={textOrPassword ? "text" : "password"}
            className="form-control"
            id="password"
            placeholder="create user password "
          />

          <button
            className="showPassword"
            type="button"
            onClick={() => setTextOrpassword(!textOrPassword)}>
            <VisibilityIcon />
          </button>

          <label htmlFor="confirmPassword">password again</label>
          <input
            required
            type="password"
            className="form-control"
            id="confirmPassword"
            placeholder="confirm password "
          />

          <small
            className={
            checkMatchPassword
            ? "passwordCheckerSignup"
            : "disableCheckerSignup"}>
            password doesn't match
          </small>
          <button>sign In</button>
        </form>
        <div className="wrapper">
          <p onClick={navigateToLogin}>already have an account</p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
