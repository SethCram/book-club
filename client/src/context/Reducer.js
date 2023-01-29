//used to dispatch actions to change user context

const Reducer = (state, action) => {
    switch(action.type){
        case "LOGIN_START":
            return{
                user: null,
                isFetching:true,
                error: false
            };
        case "LOGIN_SUCCESS":
            return{
                user: action.payload,
                isFetching:false,
                error: false
            };
        case "LOGIN_FAILURE":
            return{
                user: null,
                isFetching:false,
                error: true
            };
        case "LOGOUT":
            return{
                user: null, //clear user
                isFetching: false,
                error: false
            };
        case "USER_UPDATE_START":
            return{
                ...state, //nothing else changed
                isFetching: true
            };
        case "USER_UPDATE_SUCCESS":
            return{
                user: action.payload,
                isFetching:false,
                error: false
            };
        case "USER_UPDATE_FAILURE":
            return{
                user: state.user, //user doesnt change
                isFetching:false,
                error: true
            };
        default:
            return state;
    }
};

export default Reducer;