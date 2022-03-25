import { useEffect } from "react";
import Bio from "./bio";
import { useSelector } from "react-redux";

export default function MyProfile(props) {
    const profile = useSelector((state) => state.app);
    useEffect(() => {
        console.log("My profile mounted");
    }, []);

    return (
        <div className="profile-component">
            {props.profilePic}
            <div className="profile">
                <h1>
                    {profile.first} {profile.last}
                </h1>
                <Bio />
            </div>
        </div>
    );
}
