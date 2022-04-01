import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { receiveNgoProfile } from "../redux/ngo/slice";
import Logo from "../general/logo";
import ProfilePic from "../general/profile_pic";
import NgoRegistration from "./ngo_registration";

export default function NgoArea() {
    const dispatch = useDispatch();
    const ngoProfile = useSelector((state) => state.ngo);

    useEffect(() => {
        console.log("NGO area mounted");
        if (!ngoProfile) {
            dispatch(receiveNgoProfile());
        }
    }, []);

    console.log("ngoProfile :>> ", ngoProfile);

    if (!ngoProfile) {
        return null;
    }

    const ngoNotRegistered = (
        <>
            <NgoRegistration />
        </>
    );
    const ngoRegistered = (
        <>
            <div className="ngo-area">
                <menu>
                    <img src={ngoProfile.logo} className="profile-pic"></img>
                    <h3>Registration status</h3>
                    {ngoProfile.registration_complete == false && (
                        <h3 style={{ color: "#86C1E3" }}>Incomplete</h3>
                    )}
                    {ngoProfile.verified == false && (
                        <h3 style={{ color: "orange" }}>
                            Pending Verification
                        </h3>
                    )}
                    {ngoProfile.verified && (
                        <h3 style={{ color: "#61b99a" }}>Verified</h3>
                    )}
                    <a href="/ngo-registration" className="welcome-link">
                        <h3>Edit Profile</h3>
                    </a>
                </menu>
                <div className="ngo-area__main">
                    <section>
                        <h2>{ngoProfile.display_name}</h2>
                    </section>
                    <section>
                        <h2>Donation Overview</h2>
                    </section>
                </div>
            </div>
        </>
    );

    return (
        <>
            <nav className="nav">
                <Logo />
                <div className="nav-right">
                    <a href="/logout">Logout</a>
                    <ProfilePic />
                </div>
            </nav>
            {ngoProfile ? ngoRegistered : ngoNotRegistered}
        </>
    );
}
