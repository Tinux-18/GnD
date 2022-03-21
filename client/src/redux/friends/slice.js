export default function FriendsReducer(friends = null, action) {
    if (action.type == "friends/receiveFriends") {
        friends = action.payload.friends;
    } else if (action.type == "friends/acceptFriendRequest") {
        friends = friends.map((friend) => {
            if (friend.id === action.payload.id) {
                return { ...friend, accepted: true };
            }
            return friend;
        });
    } else if (action.type == "friends/deleteFriendRequest") {
        console.log("friends/deleteFriendRequest");
        friends = friends.filter((friend) => friend.id !== action.payload.id);
    }
    return friends;
}

export function receiveFriends(friends) {
    return {
        type: "friends/receiveFriends",
        payload: { friends },
    };
}

export function updateFriendRequest(id, updateType) {
    if (updateType == "accept") {
        return {
            type: "friends/acceptFriendRequest",
            payload: { id },
        };
    }
    if (updateType == "unfriend") {
        return {
            type: "friends/deleteFriendRequest",
            payload: { id },
        };
    }
}
