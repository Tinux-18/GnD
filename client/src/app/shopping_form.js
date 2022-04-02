import { useState, useEffect } from "react";
import Logo from "../general/logo";
import { useParams } from "react-router";
import { useStatefulFields } from "../hooks/update_stateful_fields";
import { useInputErrors } from "../hooks/validate_input";

export default function ShoppingForm() {
    const { card: rawCard } = useParams();
    let card = rawCard.replace(":", "").split(".")[0];
    let cardSrc = "/cards/" + rawCard.replace(":", "");

    const [generalError, setGeneralError] = useState(false);
    const [fields, inputUpdate] = useStatefulFields({});
    const [inputErrors, setInputErrors] = useState([]);
    const [showForm, setShowForm] = useState(true);
    const [ngos, setNgos] = useState();

    useEffect(async () => {
        const data = await fetch("/ngo/all-names.json").then((res) =>
            res.json()
        );
        setNgos(data);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        let ngoId;

        for (const ngo in ngos) {
            if (Object.hasOwnProperty.call(ngos, ngo)) {
                if (ngos[ngo].display_name == fields.ngo) {
                    ngoId = ngos[ngo].id;
                }
            }
        }
        const requiredFields = {
            receiver_email: fields.receiver_email,
            amount: fields.amount,
            ngo: fields.ngo,
        };

        let noEmptyFields = !Object.values(requiredFields).some(
            (field) => !field
        );

        setInputErrors([]);
        useInputErrors(
            Object.keys(requiredFields),
            requiredFields,
            setInputErrors
        );

        console.log("fields :>> ", fields);
        if (noEmptyFields) {
            fetch("/donation/make-donation.json", {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify({ ...fields, card: card, ngo_id: ngoId }),
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
                <label htmlFor="ngo">Organisation</label>
                <input
                    type="text"
                    name="ngo"
                    id="ngo"
                    list="ngos"
                    onChange={inputUpdate}
                />
                <datalist id="ngos">
                    {ngos &&
                        ngos.map((ngo) => {
                            return (
                                <option
                                    key={ngo.id}
                                    value={ngo.display_name}
                                ></option>
                            );
                        })}
                </datalist>
                <div className="buttons">
                    <button onClick={handleSubmit}>Purchase</button>
                    <input
                        type="reset"
                        value="Clear"
                        onClick={() => {
                            setInputErrors([]);
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
                </div>
            </nav>
            <div className="welcome">{showForm ? donationForm : success}</div>
        </>
    );
}
