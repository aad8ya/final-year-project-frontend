import React, { useContext } from 'react'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import Context from '../store/context';
import { signIn as signIntoStore, signOut as signOutStore } from '../store'
function SignIn() {
    const auth = getAuth()
    const { store, dispatch } = useContext(Context)
    const signIn = () => {
        console.log("Auth")
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                dispatch(signIntoStore(user))
                console.log(user)
                // ...

            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });
    }
    const signOutUser = () => {
        signOut(auth).then(() => {
            dispatch(signOutStore())
            alert("Signed Out")
        }).catch((error) => {
            alert("Signout failed")
        });
    }
    console.log(store.user.uid)

    return (
        <>
            <h2>User Section</h2>

            {store.user.isSignedIn ?
                <div>
                    <div>
                        Hello {store.user.displayName}
                        <div style={{ marginTop: '15px' }}>
                            <button onClick={signOutUser}>
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div> :
                <div>
                    <div>Sign in to continue</div>
                    <button onClick={signIn}>SignIn</button>
                </div>}
        </>
    )
}

export default SignIn
