import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { receiveNgoProfile } from "../redux/ngo/slice";
import Logo from "../general/logo";
import NgoRegistration from "./registration/ngo_registration";
import NgoOverview from "./ngo_overview";

export default function NgoArea() {
    const dispatch = useDispatch();
    const ngoProfile = useSelector((state) => state.ngo);
    const [showNgoRegistration, setShowNgoRegistration] = useState(false);

    useEffect(() => {
        console.log("NGO area mounted");
        if (!ngoProfile) {
            dispatch(receiveNgoProfile());
        }
    }, []);

    if (!ngoProfile) {
        return null;
    }

    const sideMenu = (
        <menu>
            <h3>Registration status</h3>
            {!ngoProfile.display_name && (
                <h3 style={{ color: "#dc4c3f" }}>Not started</h3>
            )}
            {ngoProfile.registration_complete == false && (
                <h3 style={{ color: "#86C1E3" }}>Incomplete</h3>
            )}
            {ngoProfile.verified == false &&
                ngoProfile.registration_complete && (
                    <h3 style={{ color: "orange" }}>Pending Verification</h3>
                )}
            {ngoProfile.verified && ngoProfile.registration_complete && (
                <h3 style={{ color: "#61b99a" }}>Verified</h3>
            )}
            <div className="no-selector"></div>
            <h3
                className="welcome-link"
                id="edit-profile"
                onClick={() => {
                    setShowNgoRegistration(true);
                }}
            >
                Edit Profile
            </h3>
            {showNgoRegistration ? (
                <div className="selector"></div>
            ) : (
                <div className="no-selector"></div>
            )}

            <h3
                className="welcome-link"
                onClick={() => {
                    setShowNgoRegistration(false);
                }}
            >
                Admin Portal
            </h3>
            {!showNgoRegistration ? (
                <div className="selector"></div>
            ) : (
                <div className="no-selector"></div>
            )}
        </menu>
    );

    return (
        <>
            <nav className="nav">
                <Logo />
                <div className="nav-right">
                    <a href="/">Home</a>
                    <a href="/logout">Logout</a>
                    <img
                        src={
                            ngoProfile.logo
                                ? ngoProfile.logo
                                : "/default_logo.png"
                        }
                        className="profile-pic"
                    ></img>
                </div>
            </nav>
            <div className="ngo-area">
                {sideMenu}
                <div className="ngo-area__main">
                    {showNgoRegistration ? (
                        <NgoRegistration />
                    ) : (
                        <NgoOverview />
                    )}
                </div>
            </div>
        </>
    );
}
