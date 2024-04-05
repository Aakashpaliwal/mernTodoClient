import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Header from "./components/Header/Header";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Navigate, Route, Routes } from "react-router-dom";
import AuthContainer from "./Container/AuthContainer";
import HomeContainer from "./Container/HomeContainer";
import PrivateRoutes from "./PrivateRoutes";
import MyContext from "./MyContext";

function App() {
  const [token, setToken] = useState(sessionStorage?.getItem('userToken'));
  const [userObj, setUserObj] = useState(null)

  return (
    <>
    <GoogleOAuthProvider clientId="200470102207-6k10f0g3a5f1c7m13mqu1fs5o5hj9ks3.apps.googleusercontent.com">
    <MyContext.Provider value={[ token, setToken, userObj, setUserObj]}>
      <Header />
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path="/home" exact element={<HomeContainer />} />
        </Route>
        <Route path="/" exact element={sessionStorage?.getItem('userToken')?.length > 0 ? <Navigate to='/home' /> : <AuthContainer />} />
      </Routes>
      </MyContext.Provider>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
