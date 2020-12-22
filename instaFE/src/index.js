import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reportWebVitals from "./reportWebVitals";
import App from "./App";
import rootReducer from "./reducers/rootReducer";
import "./index.css";
import thunk from "redux-thunk";

const store = createStore(rootReducer, applyMiddleware(thunk));
console.log("List of Reducers Stored in STATE 👉", store.getState());

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
