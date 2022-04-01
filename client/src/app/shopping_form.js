import { useState, useEffect } from "react";
import Logo from "../general/logo";
import ProfilePic from "../general/profile_pic";
import { useParams } from "react-router";
import { useStatefulFields } from "../hooks/update_stateful_fields ";
import { validateInput } from "../hooks/validate_input";

export default function ShoppingForm() {
    const { card: rawCard } = useParams();
    let card = rawCard.replace(":", "");
    const [generalError, setGeneralError] = useState(false);
    const [fields, inputUpdate] = useStatefulFields({});
    const [inputErrors, setInputErrors] = useState([]);

    useEffect(async () => {
        console.log("ShoppingForm mounted");
        // let abort;

        // return () => {
        //     abort = true;
        // };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setInputErrors([]);
        validateInput(
            ["first", "second", "email", "pass1"],
            fields,
            setInputErrors
        );

        // Push data

        let noEmptyFields = !Object.values(fields).some(
            (field) => field.length == 0
        );
        // if (noEmptyFields && !arePasswordsDifferent()) {
        //     const role = ngoCheck ? "organiser" : "donor";

        //     fetch("/user/addProfile.json", {
        //         method: "POST",
        //         headers: {
        //             "Content-type": "application/json; charset=UTF-8",
        //         },
        //         body: JSON.stringify({ ...fields, role: role }),
        //     })
        //         .then((res) => res.json())
        //         .then((postResponse) => {
        //             if (postResponse.success) {
        //                 location.replace("/");
        //             } else {
        //                 setGeneralError(true);
        //             }
        //         })
        //         .catch((err) => {
        //             console.log(
        //                 `fetch POST in registration failed with: ${err}`
        //             );
        //             setGeneralError(true);
        //         });
        // } else {
        //     setGeneralError(true);
        // }
    };
    return (
        <>
            <nav className="nav">
                <Logo />
                <div className="nav-right">
                    <a href="/logout">Logout</a>
                    <ProfilePic />
                </div>
            </nav>
            <div className="welcome form">
                <h2>Complete your purchase</h2>
                {generalError && (
                    <h3 id="error">Something went wrong. Please try again!</h3>
                )}
                <label htmlFor="first">First name</label>
                <input
                    name="first"
                    id="first"
                    type="text"
                    maxLength="255"
                    placeholder="Mihaela"
                    required
                    onChange={inputUpdate}
                    style={{
                        backgroundColor: inputErrors.includes("first")
                            ? "#ffafcc"
                            : "white",
                    }}
                ></input>
                <div className="buttons">
                    <button onClick={handleSubmit}>Register</button>
                    <input
                        type="reset"
                        value="Clear"
                        onClick={() => {
                            setInputErrors([]);
                            setGeneralError(false);
                            setpassError(false);
                            setCheckError(false);
                        }}
                    ></input>
                </div>
            </div>
        </>
    );
}
