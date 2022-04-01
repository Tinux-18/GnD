import { useState, useEffect } from "react";
import Logo from "../general/logo";
import ProfilePic from "../general/profile_pic";
import { useParams } from "react-router";
import { useStatefulFields } from "../hooks/update_stateful_fields ";
import { validateInput } from "../hooks/validate_input";

export default function ShoppingForm() {
    const { card: rawCard } = useParams();
    let card = rawCard.replace(":", "").split(".")[0];
    let cardSrc = "/cards/" + rawCard.replace(":", "");
    console.log("cardSrc :>> ", card);
    const [generalError, setGeneralError] = useState(false);
    const [fields, inputUpdate] = useStatefulFields({});
    const [inputErrors, setInputErrors] = useState([]);
    const [showForm, setShowForm] = useState(true);

    const handleSubmit = (e) => {
        e.preventDefault();
        const requiredFields = {
            receiver_email: fields.receiver_email,
            amount: fields.amount,
        };

        console.log("reqiuredFields :>> ", requiredFields);
        let noEmptyFields = !Object.values(requiredFields).some(
            (field) => !field
        );

        setInputErrors([]);
        validateInput(
            Object.keys(requiredFields),
            requiredFields,
            setInputErrors
        );

        if (noEmptyFields) {
            fetch("/donation/make-donation.json", {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify({ ...fields, card: card, ngo_id: 29 }),
            })
                .then((res) => res.json())
                .then((postResponse) => {
                    if (postResponse.success) {
                        setShowForm(false);
                    } else {
                        setGeneralError(true);
                    }
                })
                .catch((err) => {
                    console.log(
                        `fetch POST in registration failed with: ${err}`
                    );
                    setGeneralError(true);
                });
        }
    };

    const donationForm = (
        <>
            <img alt="donation card" src={cardSrc} />
            <div className="welcome form">
                <h2>Complete your purchase</h2>
                {inputErrors.length != 0 && (
                    <h3 id="error">Please fill in the required fields</h3>
                )}
                {generalError && inputErrors.length == 0 && (
                    <h3 id="error">Something went wrong. Please try again!</h3>
                )}
                <h3>Who are you giving to?</h3>
                <label htmlFor="name">Name</label>
                <input
                    name="receiver_name"
                    id="name"
                    type="text"
                    maxLength="255"
                    placeholder="Mihaela Alexe"
                    onChange={inputUpdate}
                ></input>
                <label htmlFor="email">Email</label>
                <input
                    name="receiver_email"
                    id="email"
                    type="email"
                    maxLength="255"
                    placeholder="mihaela.alexe@aol.com"
                    onChange={inputUpdate}
                    style={{
                        backgroundColor: inputErrors.includes("receiver_email")
                            ? "#ffafcc"
                            : "white",
                    }}
                ></input>
                <label htmlFor="message">Your message</label>
                <textarea
                    id="message"
                    name="card_message"
                    className="bio-input"
                    onChange={inputUpdate}
                ></textarea>
                <label htmlFor="amount">Amount</label>
                <input
                    name="amount"
                    id="amount"
                    type="number"
                    placeholder="20€"
                    onChange={inputUpdate}
                    style={{
                        backgroundColor: inputErrors.includes("amount")
                            ? "#ffafcc"
                            : "white",
                    }}
                ></input>
                <div className="buttons">
                    <button onClick={handleSubmit}>Purchase</button>
                    <input
                        type="reset"
                        value="Clear"
                        onClick={() => {
                            setInputError(false);
                            setGeneralError(false);
                        }}
                    ></input>
                </div>
            </div>
        </>
    );

    const success = (
        <div className="welcome form">
            <h2>Thank for caring!</h2>
            <a href="/" className="welcome-link">
                <h3>Make another pruchase</h3>
            </a>
        </div>
    );

    return (
        <>
            <nav className="nav">
                <Logo />
                <div className="nav-right">
                    <a href="/logout">Logout</a>
                    <ProfilePic />
                </div>
            </nav>
            <div className="welcome">{showForm ? donationForm : success}</div>
        </>
    );
}
