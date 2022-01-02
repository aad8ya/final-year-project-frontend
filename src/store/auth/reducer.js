import { SIGN_IN, SIGN_OUT } from "./types"

export const initialState = {
    isSignedIn: false,
    name: null,
    email: null,
    photo: null,
    uid: null,
    isVerified: null,
}

const reducer = (state, action) => {
    switch (action.type) {
        case SIGN_IN:
            return {
                ...state,
                isSignedIn: true,
                ...action.payload
            }
        case SIGN_OUT:
            return {
                ...state,
                isSignedIn: false,
                user: null
            }
        default: return state
    }
}

export default reducer