import ReactDOM from "react-dom";
import Welcome from "./welcome/welcome";
import App from "./app/app";

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import * as immutableState from "redux-immutable-state-invariant";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import reducer from "./redux/reducer.js";

const composeEnhancers = composeWithDevTools({ trace: true, traceLimit: 25 });
const middlewares = [immutableState.default(), thunk];

const store = createStore(
    reducer,
    composeEnhancers(applyMiddleware(...middlewares))
);

fetch(`/user/id.json`)
    .then((res) => res.json())
    .then(({ isUserLoggedIn }) => {
        if (isUserLoggedIn) {
            ReactDOM.render(
                <Provider store={store}>
                    <App />
                </Provider>,
                document.querySelector("main")
            );
        } else {
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        }
    })
    .catch((err) => console.log(`fetch user status failed with: ${err}`));
