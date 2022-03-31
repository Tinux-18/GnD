import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function NgoOverview() {
    useEffect(() => {
        console.log("My profile mounted");
    }, []);

    return <div className="profile-component"></div>;
}
