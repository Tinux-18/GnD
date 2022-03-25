import { BrowserRouter, Route, Link } from "react-router-dom";
import useEventListener from "@use-it/event-listener";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { receiveProfile } from "../redux/app/slice";

import Logo from "../general/logo";
import ProfilePic from "./profile_pic";
import Uploader from "./uploader";
import MyProfile from "./my_profile";
import FindUsers from "./find_users";
import OtherProfile from "./other_profile";
import Friends from "./friends";
import Chat from "./chat";

export default function App() {
    const dispatch = useDispatch();
    const app = useSelector((state) => state.app);

    useEffect(() => {
        console.log("App mounted");

        if (!app) {
            dispatch(receiveProfile());
        }

        // useEventListener("onKeyPress", (e) => {
        //     console.log("e :>> ", e);
        // });
    }, []);

    if (!app) {
        return null;
    }

    return (
        <>
            <BrowserRouter>
                <nav>
                    <Logo />
                    <div className="nav-right">
                        <Link to="/users" className="welcome-link find-users">
                            Find other leaders
                        </Link>
                        <Link to="/friends" className="welcome-link">
                            Friends
                        </Link>
                        <Link to="/chat" className="welcome-link">
                            Chat
                        </Link>
                        <a href="/logout">Logout</a>
                        <ProfilePic />
                    </div>
                </nav>
                <Route exact path="/">
                    <MyProfile profilePic={<ProfilePic />} />
                </Route>
                <Route path="/users">
                    <FindUsers />
                </Route>
                <Route path="/other-user/:otherUserId">
                    <OtherProfile />
                </Route>
                <Route path="/friends">
                    <Friends />
                </Route>
                <Route path="/chat">
                    <Chat />
                </Route>
            </BrowserRouter>

            {app.uploaderVisible && <Uploader />}
        </>
    );
}
