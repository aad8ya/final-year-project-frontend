export * as templateActions from './templates/actions'
export { signIn, signOut } from './auth/actions'

export const setLoading = state => {
    return {
        type: 'SET_LOADING_STATE',
        payload: state,

    }
}