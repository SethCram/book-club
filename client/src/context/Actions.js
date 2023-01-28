//All actions that affect user context

export const LoginStart = (userCredentials) => ({ //only use start, success, failure when fetching data
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