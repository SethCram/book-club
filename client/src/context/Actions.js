//All actions that affect user context

export const LoginStart = (userCredentials) => ({
    type: "LOGIN_START"
});

export const LoginSuccessful = (user) => ({
    type: "LOGIN_SUCCESS",
    payload: user
});

export const LoginFailure = () => ({
    type: "LOGIN_FAILURE"
});