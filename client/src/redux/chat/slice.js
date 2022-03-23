export default function ChatReducer(messages = null, action) {
    if (action.type == "messages/receiveLatestMessages") {
        messages = action.payload.messages;
    } else if (action.type == "messages/receiveNewMessage") {
        messages = [action.payload.message, ...messages];
    }
    return messages;
}

export function receiveLatestMessages(messages) {
    return {
        type: "messages/receiveLatestMessages",
        payload: { messages },
    };
}

export function receiveNewMessage(message) {
    return {
        type: "messages/receiveNewMessage",
        payload: { message },
    };
}
