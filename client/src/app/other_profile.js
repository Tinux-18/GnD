import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router";
import FriendRequestButton from "./friend_request_button";

export default function OtherProfile() {
    const { otherUserId } = useParams();
    let cleanOtherUserId = parseInt(otherUserId.replace(":", ""));
    const history = useHistory();
    const [otherUser, setotherUser] = useState({});

    useEffect(() => {
        let abort;

        fetch(`/other-user.json/:${cleanOtherUserId}`)
            .then((res) => res.json())
            .then((otherUserProfile) => {
                if (!abort) {
                    if (otherUserProfile.sameUser) {
                        history.push("/");
                    } else {
                        setotherUser(otherUserProfile);
                    }
                }
            })
            .catch((err) => {
                console.log(`fetch otherUser failed with: ${err}`);
                history.push("/");
            });

        return () => {
            abort = true;
        };
    }, []);

    return (
        <div className="my-profile">
            <img
                alt={`${otherUser.first} ${otherUser.last}`}
                src={otherUser.image || "/default_profile_pic.png"}
                className="profile-pic"
            />
            <div className="profile">
                <h1>
                    {otherUser.first} {otherUser.last}
                </h1>
                <p>{otherUser.bio}</p>
                <FriendRequestButton otherUserId={cleanOtherUserId} />
            </div>
        </div>
    );
}
