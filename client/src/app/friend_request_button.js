import { useEffect, useState } from "react";

export default function FriendRequestButton(props) {
    const [frStatus, setFrStatus] = useState("");
    useEffect(() => {
        console.log("FriendRequestButton mounted");
        let abort;

        if (props.otherUserId) {
            fetch(
                `/friend-request/status-with-other-user.json/:${props.otherUserId}`
            )
                .then((res) => res.json())
                .then((res) => {
                    if (!abort) {
                        setFrStatus(res.friendRequestStatus);
                    }
                })
                .catch((err) =>
                    console.log(`fetch friendRequestStatus failed with: ${err}`)
                );
        }

        return () => {
            abort = true;
        };
    }, []);

    function handleClick({ target }) {
        let buttonAction = target.innerText;
        let otherUserId = props.otherUserId;

        if (buttonAction == "Make friend request") {
            fetch(`/friend-request/upsert-friendship.json`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify({
                    requestType: buttonAction,
                    otherUserId: otherUserId,
                }),
            })
                .then((res) => res.json())
                .then((res) => {
                    setFrStatus(res.friendRequestStatus);
                })
                .catch((err) =>
                    console.log(`fetch friendRequestStatus failed with: ${err}`)
                );
        }
        if (buttonAction == "Accept friend request") {
            fetch(`/friend-request/upsert-friendship.json`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify({
                    requestType: buttonAction,
                    otherUserId: otherUserId,
                }),
            })
                .then((res) => res.json())
                .then((res) => {
                    setFrStatus(res.friendRequestStatus);
                })
                .catch((err) =>
                    console.log(`fetch friendRequestStatus failed with: ${err}`)
                );
        }
        if (
            buttonAction == "Cancel friend request" ||
            buttonAction == "Unfriend"
        ) {
            fetch(`/friend-request/cancel-friendship.json`, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify({
                    requestType: buttonAction,
                    otherUserId: otherUserId,
                }),
            })
                .then((res) => res.json())
                .then((res) => {
                    setFrStatus(res.friendRequestStatus);
                })
                .catch((err) =>
                    console.log(`fetch friendRequestStatus failed with: ${err}`)
                );
        }
    }

    return <button onClick={handleClick}>{frStatus}</button>;
}
