import { BrowserRouter, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Logo from "../general/logo.js";
import Registration from "./registration";
import LogIn from "./log-in";
import ResetPass from "./reset_password";

export default function Auth() {
    const [showPassReset, setShowPassReset] = useState(false);

    useEffect(() => {
        console.log("Welcome mounted");
        setShowPassReset(false);
    }, []);

    const login = (
        <div className="form">
            <LogIn />
            <a
                href="#"
                className="welcome-link"
                onClick={() => {
                    setShowPassReset(!showPassReset);
                }}
            >
                Reset your password
            </a>
        </div>
    );
    const passReset = (
        <div className="form">
            <ResetPass />
            <a
                href="#"
                className="welcome-link"
                onClick={() => {
                    setShowPassReset(!showPassReset);
                }}
            >
                Log in
            </a>
        </div>
    );
    return (
        <>
            <nav className="nav">
                <Logo />
            </nav>
            <div className="welcome">
                {showPassReset ? passReset : login}
                <div className="welcome__line"></div>
                <Registration />
            </div>
        </>
    );
}
