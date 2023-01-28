import { createContext, useReducer } from "react"
import Reducer from "./Reducer";

const INITIAL_STATE = {
    user: null,
    isfetching: false,
    error: false
};

export const Context = createContext(INITIAL_STATE);

export const ContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(Reducer, INITIAL_STATE); //reducer will update initial state

    return (
        <Context.Provider value={({
            user: state.user,
            isFetching: state.isFetching,
            error: state.error,
            dispatch
        })}>
            {children}
        </Context.Provider>
    )
};