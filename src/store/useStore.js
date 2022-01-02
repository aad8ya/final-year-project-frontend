import { useReducer } from "react"
import rootReducer from "./rootReducer"

import { initialState as user } from './auth/reducer'
import { initialState as templates } from "./templates/initialState"

const initialState = {
  app: {
    isLoading: false,
  },
  user,
  templates,
}

const useStore = () => {

  const [store, dispatch] = useReducer(rootReducer, initialState)
  return { store, dispatch }

}

export default useStore