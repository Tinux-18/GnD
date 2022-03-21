import { combineReducers } from "redux";
import FriendsReducer from "./friends/slice.js";

const rootReducer = combineReducers({
    friends: FriendsReducer,
});

export default rootReducer;
