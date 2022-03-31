import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { receiveNgoProfile } from "../redux/ngo/slice";
import Logo from "../general/logo";
import ProfilePic from "../general/profile_pic";
import NgoRegistration from "./ngo_registration";
import NgoOverview from "./ngo_overview";

export default function NgoArea() {
    const dispatch = useDispatch();
    const ngoProfile = useSelector((state) => state.ngoProfile);

    useEffect(async () => {
        console.log("NGO area mounted");
        if (!ngoProfile) {
            dispatch(receiveNgoProfile());
        }
    }, []);

    const ngoNotRegistered = (
        <>
            <NgoRegistration />
        </>
    );

    const ngoRegistered = (
        <>
            <NgoOverview />
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
