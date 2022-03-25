import { combineReducers } from "redux";
import FriendsReducer from "./friends/slice.js";
import ChatReducer from "./chat/slice.js";
import AppReducer from "./app/slice.js";

const rootReducer = combineReducers({
    friends: FriendsReducer,
    messages: ChatReducer,
    app: AppReducer,
});

export default rootReducer;
