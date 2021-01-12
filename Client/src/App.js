import React from "react";
import { useState, useEffect } from "react";
import MainRoute from "./MainRoute";

const App = () => {
  const [newUser, setNewUser] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [signUp, setSignup] = useState(false);
  const [error, setError] = useState(undefined);

  const saveNewUser = (evt) => {
    setNewUser(evt.target.value);
  };

  const saveNewPassword = (evt) => {
    setNewPassword(evt.target.value);
  };

  const click = () => {
    setSignup(!signUp);
  };

  const login = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({ userName: newUser, password: newPassword });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
      credentials: "include",
    };

    fetch("http://localhost:9999/login", requestOptions)
      .then((r) => {
        if (r.ok) {
          return { success: true };
        } else {
          return r.json();
        }
      })
      .then((r) => {
        if (r.success === true) {
          setLoggedIn(true);
        } else {
          setError(r.err);
        }
      })
      .catch((error) => console.log("error", error));
  };

  const signup = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      userName: newUser,
      password: newPassword,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
      credentials: "include",
    };

    fetch("http://localhost:9999/signup", requestOptions)
      .then((r) => {
        if (r.ok) {
          return { success: true };
        } else {
          return r.json();
        }
      })
      .then((r) => {
        if (r.success === true) {
          setLoggedIn(true);
        } else {
          setError(r.err);
        }
      })
      .catch((error) => console.log("error", error));
  };
  useEffect(() => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
      credentials: "include",
    };
    fetch("http://localhost:9999/loggedin", requestOptions)
      .then((r) => r.json())
      .then((r) => {
        if (r.ok) {
          setLoggedIn(true);
          setNewUser(r.userName);
        }
      });
  }, []);

  const fals = () => false;
  const onEnter = (event) => {
    fals();
    if (event.keyCode === 13) {
      login();
    }
  };

  return (
    // {!loggedIn?}
    <>
      {loggedIn ? (
        <MainRoute
          setLoggedIn={setLoggedIn}
          username={newUser}
          setNewUser={setNewUser}
        />
      ) : (
        <div className="container" style={{}}>
          <form onSubmit={fals} onKeyDown={onEnter}>
            <div
              style={{
                width: "400px",
                padding: "25px",
                alignItems: "center",
                borderRadius: "5%",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: "15%",
                  marginRight: "15%",
                }}
                className="mb-3"
              >
                <h1>Travel-log</h1>
                <label
                  htmlFor="exampleUserName1"
                  className="form-label"
                  style={{
                    color: "black",
                    fontFamily: "Montserrat, Arial, sans-serif",
                  }}
                >
                  Username
                </label>
                <input
                  type="text"
                  value={newUser}
                  onChange={saveNewUser}
                  className="form-control"
                  id="exampleUserName1"
                  required={true}
                ></input>
              </div>
              <div
                style={{
                  justifyContent: "center",
                  marginLeft: "15%",
                  marginRight: "15%",
                }}
                className="mb-3"
              >
                <label
                  htmlFor="exampleInputPassword1"
                  className="form-label"
                  style={{
                    color: "black",
                    fontFamily: "Montserrat, Arial, sans-serif",
                  }}
                >
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="exampleInputPassword1"
                  value={newPassword}
                  onChange={saveNewPassword}
                  required
                ></input>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  color: "whitesmoke",
                }}
              >
                {loggedIn ? "Logged In Successfully!" : error}
              </div>
              {!signUp ? (
                <>
                  <button
                    style={{
                      justifyContent: "center",
                      marginLeft: "35%",
                      marginRight: "35%",
                      marginTop: "20px",
                      width: "30%",
                      backgroundColor: "rgb(252, 218, 154)",
                      color: "rgb(22, 29, 39)",
                    }}
                    type="button"
                    className="btn btn-block"
                    onClick={login}
                  >
                    Log In
                  </button>

                  <div
                    style={{
                      marginTop: "20px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                      color: "wheat",
                    }}
                  >
                    Don't have an account?{" "}
                    <button
                      style={{ marginLeft: "20px" }}
                      className="btn btn-outline-dark"
                      onClick={click}
                    >
                      Sign Up
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    style={{
                      justifyContent: "center",
                      marginLeft: "35%",
                      marginRight: "35%",
                      marginTop: "20px",
                      width: "30%",
                      backgroundColor: "rgb(252, 218, 154)",
                      color: "rgb(22, 29, 39)",
                    }}
                    type="button"
                    className="btn btn-block"
                    onClick={signup}
                  >
                    Sign Up
                  </button>

                  <div
                    style={{
                      marginTop: "20px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                      color: "wheat",
                    }}
                  >
                    Aready have an account?{" "}
                    <button
                      style={{ marginLeft: "20px" }}
                      className="btn btn-outline-dark"
                      onClick={click}
                    >
                      Log In
                    </button>
                  </div>
                </>
              )}
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default App;
