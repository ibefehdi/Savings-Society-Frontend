// action.js
export const setUserDetails = (userDetails) => ({
    type: 'SET_USER_DETAILS',
    payload: userDetails,
});

// reducer.js
const initialState = {
    userDetails: {},
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_USER_DETAILS':
            return {
                ...state,
                userDetails: action.payload,
            };
        default:
            return state;
    }
};

export default authReducer;
