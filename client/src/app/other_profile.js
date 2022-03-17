import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router";
export default function MyProfile() {
    const { otherUserId } = useParams();
    let cleanOtherUserId = parseInt(otherUserId.replace(":", ""));
    const history = useHistory();
    const [otherUser, setotherUser] = useState({});

    useEffect(() => {
        let abort;

        fetch(`/user/otherUser.json/:${cleanOtherUserId}`)
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
            .catch((err) =>
                console.log(`fetch last users failed with: ${err}`)
            );

        return () => {
            abort = true;
        };
    }, []);

    return (
        <div className="my-profile">
            <img
                alt={`${otherUser.first} ${otherUser.last}`}
                src={otherUser.url || "/default_profile_pic.png"}
                className="profile-pic"
            />
            <div className="profile">
                <h1>
                    {otherUser.first} {otherUser.last}
                </h1>
                <p>{otherUser.bio}</p>
            </div>
        </div>
    );
}
