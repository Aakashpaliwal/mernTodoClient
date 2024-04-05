import React, { useState } from "react";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";

const AuthContainer = () => {
  const [isLoginShow, setIsLoginShow] = useState(true);
  return (
    <>
      {isLoginShow ? (
        <Login setIsLoginShow={setIsLoginShow} />
      ) : (
        <Register setIsLoginShow={setIsLoginShow} />
      )}
    </>
  );
};

export default AuthContainer;
