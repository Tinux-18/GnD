import ReactDOM from "react-dom";
import Welcome from "./welcome";

fetch("/user/id.json");
ReactDOM.render(<Welcome />, document.querySelector("main"));

// function HelloWorld() {
//     return <div>Hello, World & Fuck you!</div>;
// }