import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router";

export default function FriendRequestButton(props) {
    const [frStatus, setFrStatus] = useState("");
    useEffect(() => {
        console.log("FriendRequestButton mounted");
        let abort;
        console.log("otherUserId :>> ", props.otherUserId);
        if (props.otherUserId) {
            fetch(`/friend-request/status.json/:${props.otherUserId}`)
                .then((res) => res.json())
                .then((res) => {
                    if (!abort) {
                        console.log("Friend :>> ", res.friendRequestStatus);
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
        if (target.innerText == "Make friend request") {
            fetch(`/friend-request/add-friendship.json/:${props.otherUserId}`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify({
                    requestType: target.innerText,
                }),
            })
                .then((res) => res.json())
                .then((res) => {
                    console.log("Friend :>> ", res.friendRequestStatus);
                    setFrStatus(res.friendRequestStatus);
                })
                .catch((err) =>
                    console.log(`fetch friendRequestStatus failed with: ${err}`)
                );
        }
        if (target.innerText == "Accept friend request") {
            fetch(
                `/friend-request/confirm-friendship.json/:${props.otherUserId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                    },
                    body: JSON.stringify({
                        requestType: target.innerText,
                    }),
                }
            )
                .then((res) => res.json())
                .then((res) => {
                    console.log("Friend :>> ", res.friendRequestStatus);
                    setFrStatus(res.friendRequestStatus);
                })
                .catch((err) =>
                    console.log(`fetch friendRequestStatus failed with: ${err}`)
                );
        }
        if (
            target.innerText == "Cancel friend request" ||
            target.innerText == "Unfriend"
        ) {
            fetch(
                `/friend-request/cancel-friendship.json/:${props.otherUserId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                    },
                    body: JSON.stringify({
                        requestType: target.innerText,
                    }),
                }
            )
                .then((res) => res.json())
                .then((res) => {
                    console.log("Friend :>> ", res.friendRequestStatus);
                    setFrStatus(res.friendRequestStatus);
                })
                .catch((err) =>
                    console.log(`fetch friendRequestStatus failed with: ${err}`)
                );
        }
    }

    return <button onClick={handleClick}>{frStatus}</button>;
}
