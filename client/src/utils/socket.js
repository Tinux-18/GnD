import { io } from "socket.io-client";
import {
    receiveLatestMessages,
    receiveNewMessage,
} from "../redux/chat/slice.js";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("latestMessages", (msgs) =>
            store.dispatch(receiveLatestMessages(msgs))
        );

        socket.on("newMessage", (msg) =>
            store.dispatch(receiveNewMessage(msg))
        );
    }
};
