import { BrowserRouter, Route, Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { receiveProfile } from "../redux/app/slice";

import Logo from "../general/logo";
import Footer from "../general/footer";
import Cards from "./cards";
import Auth from "../auth/auth";
import NgoArea from "../ngo/ngo_area";
import NgoRegistration from "../ngo/ngo_registration";
import ShoppingForm from "./shopping_form";

export default function App() {
    const dispatch = useDispatch();
    const app = useSelector((state) => state.app);

    useEffect(() => {
        console.log("App mounted");

        if (!app) {
            dispatch(receiveProfile());
        }
    }, []);

    if (!app) {
        return null;
    }

    const loggedInNav = (
        <>
            {app.role == "organiser" && (
                <Link to="/ngo-area" className="welcome-link">
                    Your organisation
                </Link>
            )}
            <a href="/logout">Logout</a>
        </>
    );

    const loggedOutNav = (
        <>
            <Link to="/auth" className="welcome-link">
                Login
            </Link>
        </>
    );

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
                </Route>
                <Route path="/auth">
                    <Auth />
                </Route>
                <Route path="/ngo-area">
                    <NgoArea />
                </Route>
                <Route path="/ngo-registration">
                    <NgoRegistration />
                </Route>
                <Route path="/shopping/:card">
                    {app.isUserLoggedIn ? <ShoppingForm /> : <Auth />}
                </Route>
            </BrowserRouter>
            <Footer />
        </>
    );
}
