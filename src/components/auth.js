import React, { useContext } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import Context from "../store/context";
import { signIn as signIntoStore, signOut as signOutStore } from "../store";
function SignIn() {
  const auth = getAuth();
  const { store, dispatch } = useContext(Context);
  const signIn = () => {
    console.log("Auth");
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        dispatch(signIntoStore(user));
        console.log(user);
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };
  const signOutUser = () => {
    signOut(auth)
      .then(() => {
        dispatch(signOutStore());
        alert("Signed Out");
      })
      .catch((error) => {
        alert("Signout failed");
      });
  };
  console.log(store.user.uid);

  return (
    <div style={{ width: "100%", height: "80%", display: "flex" }}>
      <div
        style={{
          margin: "0 auto",
          verticalAlign: "center",
          border: "1px solid #BED7E1",
          borderRadius: 10,
          width: 300,
          height: 100,
          display: "flex",
        }}
      >
        {store.user.isSignedIn ? (
          <div
            style={{ margin: "auto", display: "flex", flexDirection: "column" }}
          >
            <span style={{ fontFamily: "monospace", fontSize: 18 }}>
              Hello {store.user.displayName}
            </span>
            <div
              onClick={signOutUser}
              style={{
                border: "2px solid #BED7E1",
                backgroundColor: "#BED7E1",
                borderRadius: 5,
                height: 30,
                display: "flex",
                width: 80,
                cursor: "pointer",
                margin: "auto",
                marginTop: 15,
              }}
            >
              <div
                style={{
                  margin: "auto",
                  fontWeight: "bold",
                  fontFamily: "monospace",
                  color: "white",
                  fontSize: 14,
                }}
              >
                Sign Out
              </div>
            </div>
          </div>
        ) : (
          <div style={{ margin: "auto" }}>
            <div>Sign in to continue</div>
            <button onClick={signIn}>SignIn</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SignIn;
