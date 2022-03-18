import { useEffect } from "react";
import Bio from "./bio";
import FriendRequestButton from "./friend_request_button";

export default function MyProfile(props) {
    useEffect(() => {
        console.log("My profile mounted");
    }, []);

    return (
        <div className="my-profile">
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
                <FriendRequestButton />
            </div>
        </div>
    );
}
