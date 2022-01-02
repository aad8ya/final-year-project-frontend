import React from "react"
import useStore from "./useStore"
import Context from "./context"

const StoreProvider = ({ children }) => {
    const store = useStore()
    return (
        <Context.Provider value={{ ...store }}>
            {children}
        </Context.Provider>
    )
}

export default StoreProvider