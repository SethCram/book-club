import { createContext, useEffect, useReducer } from "react"
import Reducer from "./Reducer";

const INITIAL_STATE = { //runs on every refresh
    user: JSON.parse(localStorage.getItem("user")) || null, //takes user stored locally if there is one
    isfetching: false,
    error: false
};

export const Context = createContext(INITIAL_STATE);

export const ContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(Reducer, INITIAL_STATE); //reducer will update initial state

    useEffect(() => { //everytime context user changes, store them in local storage 
        localStorage.setItem("user", JSON.stringify(state.user));
    }, [state.user]);

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