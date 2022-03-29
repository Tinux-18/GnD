import { BrowserRouter, Route } from "react-router-dom";
import { useEffect } from "react";

import Logo from "../general/logo.js";
import Footer from "../general/footer";
import Registration from "./registration";
import LogIn from "./log-in";
import ResetPass from "./reset_password";

export default function Welcome() {
    useEffect(() => {
        console.log("Welcome mounted");
    }, []);
    return (
        <>
            <nav>
                <div className="nav-left">
                    <Logo />
                    <h1>Dar din Dar</h1>
                </div>
            </nav>
            <div className="welcome">
                <BrowserRouter>
                    <Route exact path="/">
                        <LogIn />
                        <div className="welcome__line"></div>
                        <Registration />
                    </Route>
                    <Route path="/password-reset">
                        <ResetPass />
                    </Route>
                </BrowserRouter>
            </div>
            <Footer />
        </>
    );
}
