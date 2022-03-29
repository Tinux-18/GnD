import { BrowserRouter, Route } from "react-router-dom";
import { useEffect } from "react";

import Logo from "../general/logo.js";
import Footer from "../general/footer";
import Registration from "./registration";
import LogIn from "./log-in";
import ResetPass from "./reset_password";

export default function Auth() {
    useEffect(() => {
        console.log("Welcome mounted");
    }, []);
    return (
        <>
            <nav className="nav">
                <Logo />
            </nav>
            <div className="welcome">
                <BrowserRouter>
                    <Route exact path="/auth">
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
