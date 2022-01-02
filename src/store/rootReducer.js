import { useReducer } from "react"
import user from "./auth/reducer"
import templates from "./templates/reducer"

const combineReducers = (slices) => (state, action) =>
    Object.keys(slices).reduce( // use for..in loop, if you prefer it
        (acc, prop) => ({
            ...acc,
            [prop]: slices[prop](acc[prop], action),
        }),
        state
    )

const app = (state = { isLoading: false }, action) => {
    switch (action.type) {
        case "SET_LOADING_STATE":
            return {
                ...state,
                isLoading: action.payload,
            }
        default:
            return state
    }
}

const reducers = {
    app,
    templates,
    user,
}

const rootReducer = combineReducers(reducers)

export default rootReducer