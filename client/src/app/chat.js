import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useStatefulFields } from "../hooks/useStatefulFields";
import formatDate from "../utils/formatDate";
import { socket } from "../utils/socket";

export default function Chat() {
    const [fields, inputUpdate] = useStatefulFields({
        msg: "",
    });
    const messages = useSelector((state) => state.messages);

    useEffect(() => {
        console.log("Chat mounted");
    }, []);

    function handleClick(e) {
        e.preventDefault();
        if (fields.msg) {
            socket.emit("newMessage", fields.msg);
        }
    }

    if (!messages) {
        return null;
    }

    return (
        <div className="component-container chat-container">
            <div className="messages">
                {messages.length == 0 && <h3>We&apos;re a silent bunch.</h3>}
                {messages.map((message) => (
                    <div key={message.id} className="message">
                        <div className="commenter">
                            <a href={`/other-user/:${message.user_id}`}>
                                <img
                                    className="commenter__img"
                                    src={message.image}
                                    alt={`${message.first} ${message.last}`}
                                ></img>
                            </a>
                            <a
                                className="commenter__name"
                                href={`/other-user/:${message.user_id}`}
                            >
                                {message.first} {message.last}
                            </a>
                            <p>{formatDate(message.created_at)}</p>
                        </div>
                        <p className="message_text">{message.message}</p>
                    </div>
                ))}
            </div>
            <div className="add-message">
                <button onClick={handleClick}>Submit</button>
                <textarea
                    name="msg"
                    onChange={inputUpdate}
                    onKeyPress={(e) => {
                        if (e.key == "Enter") {
                            handleClick();
                            e.preventDefault();
                        }
                    }}
                ></textarea>
            </div>
        </div>
    );
}
