// Import libraries
//// Redux
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import * as immutableState from "redux-immutable-state-invariant";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import reducer from "./redux/reducer.js";
import { init } from "./utils/socket.js";

// Import components
import ReactDOM from "react-dom";
import Auth from "./auth/auth";
import App from "./app/app";

// Redux set-up
const composeEnhancers = composeWithDevTools({ trace: true, traceLimit: 25 });
const middlewares = [immutableState.default(), thunk];
const store = createStore(
    reducer,
    composeEnhancers(applyMiddleware(...middlewares))
);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.querySelector("main")
);