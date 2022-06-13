import React, { useState, useEffect, useContext } from "react";
import "./App.css";
import SignIn from "./components/auth";
import Template from "./components/template";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Certificate from "./components/certificate.js";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import CanvasContainer from "./components/builder/canvasContainer.js";
import Context from "./store/context";
import { signIn } from "./store";
import { setLoading } from "./store";
import ViewCertificate from "./components/viewCertificate";
import RecipientPortal from "./components/recipientPortal";
import RequestedChanges from "./components/requestedChanges";

function App() {
  const { store, dispatch } = useContext(Context);
  const auth = getAuth();
  const [user, setUser] = useState(store.user || null);
  const [pathname, setPathName] = useState("");

  const toolBarStyles = {
    margin: "auto 15px",
    color: "gray",
    cursor: "pointer",
    fontFamily: "monospace",
    fontSize: 18,
    fontWeight: "bold",
  };

  useEffect(() => {
    dispatch(setLoading(true));
  }, []);

  useEffect(() => {
    setPathName(window.location.pathname.slice(0, 17));
  }, [window.location.pathname]);

  useEffect(() => {
    onAuthStateChanged(auth, (user_obj) => {
      if (user_obj) {
        setUser(user_obj);
      } else {
        console.log("No user");
      }
    });
  });

  useEffect(() => {
    dispatch(signIn(user));
    console.log("UserId from App.js", user.uid);
  }, [user]);

  const toolbar = () => {
    if (pathname === "/view_certificate") {
      return;
    } else if (pathname === "/recipient_portal") {
      return (
        <div
          style={{
            width: "100%",
            height: "50px",
            backgroundColor: "#dfedf2",
            boxShadow: "10px 1px 3px rgba(50, 50, 50, 0.25)",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div
            style={toolBarStyles}
            onClick={() => {
              window.location.replace("/signin");
            }}
          >
            SignIn
          </div>
          <div
            style={toolBarStyles}
            onClick={() => {
              window.location.replace("/recipient_portal/my_certificates");
            }}
          >
            My Certificates
          </div>
        </div>
      );
    }

    return (
      <div
        style={{
          width: "100%",
          height: "50px",
          backgroundColor: "#dfedf2",
          boxShadow: "10px 1px 3px rgba(50, 50, 50, 0.25)",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div
          style={toolBarStyles}
          onClick={() => {
            window.location.replace("/signin");
          }}
        >
          SignIn
        </div>
        <div
          style={toolBarStyles}
          onClick={() => {
            window.location.replace("/certificates");
          }}
        >
          Certificates
        </div>
        <div
          style={toolBarStyles}
          onClick={() => {
            window.location.replace("/templates");
          }}
        >
          Templates
        </div>
        <div
          style={toolBarStyles}
          onClick={() => {
            window.location.replace("/view_requested_changes");
          }}
        >
          Change Requests
        </div>
      </div>
    );
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div
        style={{
          width: "100%",
          height: "70px",
          display: "flex",
          backgroundColor: "#BED7E1",
        }}
      >
        <div
          style={{
            margin: "auto auto auto 10px",
            color: "white",
            fontFamily: "monospace",
            fontSize: 30,
            cursor: "pointer",
            padding: "15px 0",
          }}
          onClick={() => {
            window.location = "/signin";
          }}
        >
          Certify
        </div>
      </div>
      <Router>
        <Switch>
          <>
            {toolbar()}
            {store.user.uid ? (
              <>
                <Route path="/signin" exact>
                  <SignIn />
                </Route>
                <Route path="/templates" exact>
                  <Template />
                </Route>
                <Route path="/certificates" exact>
                  <Certificate />
                </Route>
                <Route path="/view_requested_changes" exact>
                  <RequestedChanges />
                </Route>
                <Route path="/view_certificate/:id" exact>
                  <ViewCertificate />
                </Route>
                <Route path="/recipient_portal/my_certificates" exact>
                  <RecipientPortal />
                </Route>
              </>
            ) : (
              <>
                <SignIn />
              </>
            )}
          </>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
