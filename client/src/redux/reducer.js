import { combineReducers } from "redux";
import NgoReducer from "./ngo/slice.js";
import ChatReducer from "./chat/slice.js";
import AppReducer from "./app/slice.js";

const rootReducer = combineReducers({
    ngo: NgoReducer,
    messages: ChatReducer,
    app: AppReducer,
});

export default rootReducer;
