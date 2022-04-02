import { combineReducers } from "redux";
import NgoReducer from "./ngo/slice.js";
import AppReducer from "./app/slice.js";

const rootReducer = combineReducers({
    ngo: NgoReducer,
    app: AppReducer,
});

export default rootReducer;
