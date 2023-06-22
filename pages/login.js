import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import axios from "axios";

// async function loginUser(credentials) {
//   return fetch("http://localhost:8080/login", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(credentials),
//   }).then((data) => data.json());
// }

export default function Login({ setToken }) {
  // const [username, setUsername] = useState();
  // const [password, setPassword] = useState();

  // const handleSubmit = async (e) => {
  //   if (username === undefined || password === undefined)
  //     return alert("Please fill in all fields");
  //   e.preventDefault();
  //   const token = await loginUser({
  //     username,
  //     password,
  //   });
  //   setToken(token);
  // };

  const [data, setData] = useState({});
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getusers();
  }, []);

  const getusers = async () => {
    axios.get("http://localhost/api/user/").then((res) => {
      // console.log(res.data);
      setUsers(res.data);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    users.map((user) => {
      if (user.username === data.username && user.password === data.password) {
        console.log("match");
        // set token
        setToken({
          username: user.username,
          password: user.password,
        });
        // window.location.href = "/";
      }
    });
  };

  return (
    <div className="login-wrapper">
      <h1 className="">Please Log In</h1>
      <form>
        <label>
          <p>Username</p>
          <input
            type="text"
            // onChange={(e) => setUsername(e.target.value)}
            onChange={(e) => setData({ ...data, username: e.target.value })}
            required
          />
        </label>
        <label>
          <p>Password</p>
          <input
            type="password"
            // onChange={(e) => setPassword(e.target.value)}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            required
          />
        </label>
        <div>
          <button type="submit" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </form>
      <div className="login-wrapper">
        <Link href="/signup">
          <a>Sign Up</a>
        </Link>
      </div>
    </div>
  );
}

// Login.propTypes = {
//   setToken: PropTypes.func.isRequired,
// };
