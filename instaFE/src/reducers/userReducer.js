import { actionTypes } from "../actions/actionTypes";

export const initialState = {
  user: null,
  username: "",
  email: "",
  password: "",
};

const userReducer = (state = initialState, action) => {
  console.log(` 💪 ${action.type} ACTION 💪`, action);
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.user,
      };
    case actionTypes.SET_USERNAME:
      return {
        ...state,
        username: action.username,
      };
    case actionTypes.SET_PASSWORD:
      return {
        ...state,
        password: action.password,
      };
    case actionTypes.SET_EMAIL:
      return {
        ...state,
        email: action.email,
      };
    default:
      return state;
  }
};

export default userReducer;
