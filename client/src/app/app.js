import { BrowserRouter, Route, Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { receiveProfile } from "../redux/app/slice";

import Logo from "../general/logo";
import Footer from "../general/footer";
import ProfilePic from "./profile_pic";
import Uploader from "./uploader";
import Cards from "./cards";
import Auth from "../auth/auth";

export default function App() {
    const dispatch = useDispatch();
    const app = useSelector((state) => state.app);

    useEffect(() => {
        console.log("App mounted");

        if (!app) {
            dispatch(receiveProfile());
        }
    }, []);

    const loggedOutNav = (
        <>
            <Link to="/auth" className="welcome-link">
                Login
            </Link>
        </>
    );

    const loggedInNav = (
        <>
            <Link to="/ngo" className="welcome-link">
                Your organisation
            </Link>
            <a href="/logout">Logout</a>
            {/* <ProfilePic /> */}
        </>
    );

    if (!app) {
        return null;
    }

    return (
        <>
            <BrowserRouter>
                <Route exact path="/">
                    <nav>
                        <Logo />
                        <div className="nav-right">
                            {app.isUserLoggedIn ? loggedInNav : loggedOutNav}
                        </div>
                    </nav>
                    <Cards />
                    <Footer />
                </Route>
                <Route path="/auth">
                    <Auth />
                </Route>
            </BrowserRouter>
        </>
    );
}
