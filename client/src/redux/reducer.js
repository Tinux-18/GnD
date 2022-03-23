import { combineReducers } from "redux";
import FriendsReducer from "./friends/slice.js";
import ChatReducer from "./chat/slice.js";

const rootReducer = combineReducers({
    friends: FriendsReducer,
    messages: ChatReducer,
});

export default rootReducer;
