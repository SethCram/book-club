//All actions that affect user context

//should use these instead of Reducer 

export const LoginStart = () => ({ //only use start, success, failure when fetching data
    type: "LOGIN_START"
});
export const LoginSuccessful = (user) => ({
    type: "LOGIN_SUCCESS",
    payload: user
});
export const LoginFailure = () => ({
    type: "LOGIN_FAILURE"
});

export const Logout = () => ({
    type: "LOGOUT"
});

export const UserUpdateStart = () => ({ //only use start, success, failure when fetching data
    type: "USER_UPDATE_START"
});
export const UserUpdateSuccessful = (user) => ({
    type: "USER_UPDATE_SUCCESS",
    payload: user
});
export const UserUpdateFailure = () => ({
    type: "USER_UPDATE_FAILURE"
});