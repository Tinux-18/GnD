import { useEffect } from "react";
import Bio from "./bio";

export default function MyProfile(props) {
    useEffect(() => {
        console.log("My profile mounted");
    }, []);

    return (
        <div className="profile-component">
            {props.profilePic}
            <div className="profile">
                <h1>
                    {props.first} {props.last}
                </h1>
                <Bio
                    bio={props.bio}
                    updateBio={(bio) => {
                        props.updateBio(bio);
                    }}
                />
            </div>
        </div>
    );
}
