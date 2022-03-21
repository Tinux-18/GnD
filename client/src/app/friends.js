import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { receiveFriends, updateFriendRequest } from "../redux/friends/slice";

export default function Friends() {
    const dispatch = useDispatch();
    const friends = useSelector(
        (state) =>
            state.friends &&
            state.friends.filter((friend) => friend.accepted == true)
    );
    const pendingFriends = useSelector(
        (state) =>
            state.friends &&
            state.friends.filter(
                (friend) =>
                    friend.accepted == false && friend.id === friend.sender_id
            )
    );
    const awaitingFriends = useSelector(
        (state) =>
            state.friends &&
            state.friends.filter(
                (friend) =>
                    friend.accepted == false && friend.id !== friend.sender_id
            )
    );
    useEffect(() => {
        console.log("friends :>> ", friends);
        if (!friends) {
            (async () => {
                const res = await fetch(
                    "/friend-request/status-with-all-users.json"
                );
                const data = await res.json();
                dispatch(receiveFriends(data.rows));
            })();
        }
    }, []);

    async function handleClick(otherUserId, buttonAction) {
        if (buttonAction == "unfriend") {
            const res = await fetch(`/friend-request/cancel-friendship.json`, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify({
                    requestType: buttonAction,
                    otherUserId: otherUserId,
                }),
            });
            const data = await res.json();
            if (data.friendRequestStatus) {
                dispatch(updateFriendRequest(otherUserId, "unfriend"));
            }
        }

        if (buttonAction == "Accept friend request") {
            const res = await fetch(`/friend-request/upsert-friendship.json`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify({
                    requestType: buttonAction,
                    otherUserId: otherUserId,
                }),
            });
            const data = await res.json();
            if (data.friendRequestStatus) {
                dispatch(updateFriendRequest(otherUserId, "accept"));
            }
        }
    }

    if (!friends) {
        return null;
    }
    return (
        <div className="friends">
            <section className="find-users">
                <h2>Friends</h2>
                <div className="results">
                    {friends.length < 1 && <h3>You have not friend here</h3>}
                    {friends.map((friend) => (
                        <div key={friend.id} className="result">
                            <a href={`/other-user/:${friend.id}`}>
                                <img
                                    className="result__img"
                                    src={friend.image}
                                    alt={`${friend.first} ${friend.last}`}
                                ></img>
                            </a>
                            <a
                                className="result__text"
                                href={`/other-user/:${friend.id}`}
                            >
                                {friend.first} {friend.last}
                            </a>
                            <button
                                onClick={() =>
                                    handleClick(friend.id, "unfriend")
                                }
                            >
                                Unfriend
                            </button>
                        </div>
                    ))}
                </div>
                <h2>Future friends</h2>
                <div className="results">
                    {pendingFriends.length < 1 && (
                        <h3>Nobody wants to be your friend</h3>
                    )}
                    {pendingFriends.map((friend) => (
                        <div key={friend.id} className="result">
                            <a href={`/other-user/:${friend.id}`}>
                                <img
                                    className="result__img"
                                    src={friend.image}
                                    alt={`${friend.first} ${friend.last}`}
                                ></img>
                            </a>
                            <a
                                className="result__text"
                                href={`/other-user/:${friend.id}`}
                            >
                                {friend.first} {friend.last}
                            </a>
                            <button
                                onClick={() =>
                                    handleClick(
                                        friend.id,
                                        "Accept friend request"
                                    )
                                }
                            >
                                Accept friend
                            </button>
                        </div>
                    ))}
                </div>
                <h2>Possible friends</h2>
                <div className="results">
                    {awaitingFriends.length < 1 && (
                        <h3>Nobody wants to be your friend</h3>
                    )}
                    {awaitingFriends.map((friend) => (
                        <div key={friend.id} className="result">
                            <a href={`/other-user/:${friend.id}`}>
                                <img
                                    className="result__img"
                                    src={friend.image}
                                    alt={`${friend.first} ${friend.last}`}
                                ></img>
                            </a>
                            <a
                                className="result__text"
                                href={`/other-user/:${friend.id}`}
                            >
                                {friend.first} {friend.last}
                            </a>
                            <button
                                onClick={() =>
                                    handleClick(friend.id, "unfriend")
                                }
                            >
                                Nevermind
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
