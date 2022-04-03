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
                id="reset-link"
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
            <ResetPass
                showPassReset={showPassReset}
                setShowPassReset={setShowPassReset}
            />
        </div>
    );
    return (
        <>
            <nav className="nav">
                <Logo />
            </nav>
            <div className="welcome auth">
                {showPassReset ? passReset : login}
                <div className="welcome__line"></div>
                <Registration />
            </div>
        </>
    );
}
