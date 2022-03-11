import ReactDOM from "react-dom";
import Welcome from "./welcome";
import App from "./app";

fetch(`/user/id.json`)
    .then((res) => res.json())
    .then(({ isUserLoggedIn }) => {
        if (isUserLoggedIn) {
            ReactDOM.render(<App />, document.querySelector("main"));
        } else {
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        }
    })
    .catch((err) => console.log(`fetch user status failed with: ${err}`));
