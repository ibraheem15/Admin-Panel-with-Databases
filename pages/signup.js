import axios from "axios";
import React, { useState } from "react";

function signup() {
  const [data, setData] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost/api/user/save",
        data
      ).then((res) => {
        console.log(res.data);
        //redirect to login page
        window.location.href = "/login";

      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData({ ...data, [name]: value });
  };

  return (
    <div className="login-wrapper">
      <h1 className="">Please Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Username</p>
          <input type="text" required onChange={handleChange} name="username" />
        </label>
        <label>
          <p>Password</p>
          <input
            type="password"
            required
            onChange={handleChange}
            name="password"
          />
        </label>
        <label>
          <p>Mobile</p>
          <input type="text" required onChange={handleChange} name="mobile" />
        </label>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default signup;
