import { combineReducers } from "redux";
import userReducer from "./userReducer";
import postReducer from "./postReducer";
import { openReducer } from "./modalReducer";
import { scrollReducer } from "./scrollReducer";

const rootReducer = combineReducers({
  userReducer,
  postReducer,
  openReducer,
  scrollReducer,
});

export default rootReducer;
