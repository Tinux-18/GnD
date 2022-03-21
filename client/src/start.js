import ReactDOM from "react-dom";
import Welcome from "./welcome/welcome";
import App from "./app/app";

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import * as immutableState from "redux-immutable-state-invariant";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./redux/reducer.js";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(immutableState.default()))
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
