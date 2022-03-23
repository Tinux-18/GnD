import { useEffect } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { useStatefulFields } from "../hooks/useStatefulFields";
import formatDate from "../utils/formatDate";
const socket = io();
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
            console.log("fields.msg :>> ", fields.msg);
            // socket.emit("newMessage", fields.msg);
        }
    }

    if (!messages) {
        return null;
    }

    return (
        <div className="component-container chat-container">
            <div className="messages">
                {!messages && <h3>We&apos;re a silent bunch.</h3>}
                {messages &&
                    messages.map((message) => (
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
// const messages = [
//     {
//         id: 16,
//         message:
//             "The swallow may fly south with the sun or the house martin or the plumber may seek warmer climes in winter yet these are not strangers to our land.",
//         created_at: `2022-03-23T09:55:05.679Z`,
//         user_id: 200,
//         first: "Carles",
//         last: "Schafer",
//         image: "https://images-na.ssl-images-amazon.com/images/M/MV5BOTI3ODk1MTMyNV5BMl5BanBnXkFtZTcwNDEyNTE2Mg@@._V1_UY256_CR6,0,172,256_AL_.jpg",
//     },
//     {
//         id: 15,
//         message: "Well, this is a temperate zone.",
//         created_at: `2022-03-23T09:55:05.679Z`,
//         user_id: 201,
//         first: "Alin",
//         last: "Radu",
//         image: "https://s3.amazonaws.com/constantin-portofolio/u6gjRyAqh87yR2zwXYP9bA_kRCBTYrxc.jpg",
//     },
// {
//     id: 14,
//     message: "What do you mean?",
//     created_at: `2022-03-23T09:55:05.679Z`,
//     user_id: 200,
//     first: "Carles",
//     last: "Schafer",
//     image: "https://images-na.ssl-images-amazon.com/images/M/MV5BOTI3ODk1MTMyNV5BMl5BanBnXkFtZTcwNDEyNTE2Mg@@._V1_UY256_CR6,0,172,256_AL_.jpg",
// },
// ];
