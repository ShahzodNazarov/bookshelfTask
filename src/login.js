import VisibilityIcon from "@mui/icons-material/Visibility";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios, { Axios } from "axios";

function Login() {
  let [checkMatchPassword, setCheckMatchPassword] = useState(false);
  const [textOrPassword, setTextOrpassword] = useState(false);
  let [users, setUsers] = useState([]);
  let navigate = useNavigate();

  function resetForm() {
    document.getElementById("form").reset();
  }

  const { data } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const response = await axios.get("http://165.73.244.77:3000/users");
      return response.data;
    },
  });

  useEffect(() => {
    axios.get("http://165.73.244.77:3000/users").then((res) => {
      setUsers(res.data);
    });
  }, [data]);

  function logIn(event) {
    event.preventDefault();
    let Email = event.target[0].value;
    let password = event.target[2].value;

    users.map((user) => {
      if (user.email == Email && user.password == password) {
        navigate("bookshelf");
        setCheckMatchPassword(false);
      } else {
        resetForm();
        setCheckMatchPassword(true);
      }
    });
  }

  function navigateToSignIn() {
    navigate("/");
  }

  return (
    <div className="container">

      <div className="row">
        <form onSubmit={logIn} id="form">

          <h2>login</h2>
          <label htmlFor="email">Email</label>
          <input
            required
            type="email"
            className="form-control"
            id="email"
            placeholder="example@gmail.com"
          />

           <button
            className="showPasswordLogin"
            type="button"
            onClick={() => setTextOrpassword(!textOrPassword)}>
            <VisibilityIcon />
            </button>

          <label htmlFor="password">password</label>
          <input
            required
            type={textOrPassword ? "text" : "password"}
            className="form-control"
            id="password"
            placeholder="enter the password " />
          <small
            className={
            checkMatchPassword
            ? "passwordCheckerLogin"
            : "disableCheckerLogin"}>
            email or password doesn't match
          </small>
          <button>Log In</button>
        </form>
        <div className="wrapper">
          <p onClick={navigateToSignIn}>I don't have an account</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
