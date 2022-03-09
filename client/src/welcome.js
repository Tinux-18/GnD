import React from "react";
import Registration from "./registration";
import LogIn from "./log-in";
import ResetPass from "./reset_password";

export default class Welcome extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        console.log("Welcome component mounted");
    }
    render() {
        return (
            <>
                <Registration />
            </>
        );
    }
}
