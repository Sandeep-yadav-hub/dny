import React from "react";
// import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store";
import "./index.css";
import App from "./App";

// After
import { createRoot } from 'react-dom/client';
const container = document.getElementById('root');
const root = createRoot(container); 
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
// root.render(<h1>Hello, world!</h1>);