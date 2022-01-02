import React, { useState, useEffect, useContext } from 'react'
import './App.css'
import SignIn from './components/auth'
import Template from './components/template'
import { getAuth, onAuthStateChanged } from "firebase/auth"
import Certificate from './components/certificate.js'
import { BrowserRouter as Router, Switch, Route, Link, } from "react-router-dom"
import CanvasContainer from './components/builder/canvasContainer.js'
import Context from './store/context'
import { signIn } from './store'
import { setLoading } from './store'
function App() {
  const { store, dispatch } = useContext(Context)
  const auth = getAuth()
  const [user, setUser] = useState(store.user || null)

  useEffect(() => {
    dispatch(setLoading(true))
  }, [])

  useEffect(() => {
    onAuthStateChanged(auth, (user_obj) => {
      if (user_obj) {
        setUser(user_obj)
      } else {
        console.log("No user")
      }
    })
  })

  useEffect(() => {
    dispatch(signIn(user))
    console.log("UserId from App.js", user.uid)
  }, [user])

  return (
    <>
      <div className='container'>
        <h1>Certify</h1>
      </div>
      <Router>
        <Switch>
          <>
            <ul style={{ listStyle: 'none', display: "flex", flexDirection: "row" }}>
              <li style={{ margin: '5px' }}>
                <Link to={`/signin`}>SignIn</Link>
              </li>
              <li style={{ margin: '5px' }}>
                <Link to={`/certificates`}>Certificates</Link>
              </li>
              <li style={{ margin: '5px' }}>
                <Link to={`/templates`}>Templates</Link>
              </li>
            </ul>
            {store.user.uid ?
              <>
                <Route path='/signin' exact>
                  <SignIn />
                </Route>
                <Route path='/templates' exact>
                  <Template />
                </Route>
                <Route path='/certificates' exact>
                  <Certificate />
                </Route>
              </> : <div>No user Signed in <SignIn /></div>
            }
          </>
        </Switch>
      </Router>
    </>
  )
}

export default App
