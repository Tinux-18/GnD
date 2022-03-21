import { receiveFriends, updateFriendRequest } from "../redux/friends/slice";

export async function receiveUsers() {
    return async (dispatch) => {
        const data = await fetch(
            "/friend-request/status-with-all-users.json"
        ).then((response) => response.json());
        dispatch({
            type: "friends/receiveFriends",
            payload: {
                users: data.users,
            },
        });
    };
}
