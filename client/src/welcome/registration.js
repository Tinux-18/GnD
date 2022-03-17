import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import { useStatefulFields } from "../hooks/useStatefulFields";
import { validateInput } from "../hooks/validate_input";

export default function SignIn() {
    const [generalError, setGeneralError] = useState(false);
    const [error, setError] = useState(false);
    const [passError, setpassError] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] =
        useState(false);
    const [inputErrors, setInputErrors] = useState([]);
    const [fields, inputUpdate] = useStatefulFields({
        first: "",
        second: "",
        email: "",
        pass1: "",
        pass2: "",
    });

    useEffect(() => {
        console.log("HIPSTER Registration mounted");
    }, []);

    const showConfirmPassword = (e) => {
        if (e.target.value.length <= 1 && e.code == "Backspace") {
            setShowPasswordConfirmation(false);
        } else {
            setShowPasswordConfirmation(true);
        }
    };

    const confirmPassword = () => {
        if (fields.pass1 !== fields.pass2) {
            setpassError(true);
        } else {
            setpassError(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setInputErrors([]);
        validateInput(
            ["first", "second", "email", "pass1"],
            fields,
            setInputErrors
        );
        confirmPassword();
        // Push data
        if (
            fields.first &&
            fields.second &&
            fields.email &&
            fields.pass1 &&
            fields.pass2
        ) {
            fetch("/user/addProfile.json", {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify({
                    first: fields.first,
                    second: fields.second,
                    email: fields.email,
                    pass: fields.pass1,
                }),
            })
                .then((res) => res.json())
                .then((postResponse) => {
                    console.log("res :>> ", postResponse);
                    if (postResponse.success) {
                        location.reload();
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
        } else {
            setError(true);
        }
    };

    return (
        <>
            <form id="registration-form">
                <label htmlFor="registration-form">
                    <h2>Register NOW!</h2>
                </label>
                {inputErrors.length != 0 && (
                    <h3 id="error">Please fill in the required fields</h3>
                )}
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
                <label htmlFor="second">Last name</label>
                <input
                    name="second"
                    id="second"
                    type="text"
                    maxLength="255"
                    placeholder="Drăgan"
                    required
                    onChange={inputUpdate}
                    style={{
                        backgroundColor: inputErrors.includes("second")
                            ? "#ffafcc"
                            : "white",
                    }}
                ></input>
                <label htmlFor="email">Email</label>
                <input
                    name="email"
                    id="email"
                    type="email"
                    maxLength="255"
                    placeholder="miha.dragan@tnb.ro"
                    onChange={inputUpdate}
                    required
                    style={{
                        backgroundColor: inputErrors.includes("email")
                            ? "#ffafcc"
                            : "white",
                    }}
                ></input>
                {passError && <h4 id="error">Your passwords do not match</h4>}
                <label htmlFor="pass1">Password</label>
                <input
                    name="pass1"
                    id="pass1"
                    type="password"
                    minLength="3"
                    placeholder="***"
                    required
                    onChange={(e) => {
                        inputUpdate(e);
                        showConfirmPassword(e);
                    }}
                    style={{
                        backgroundColor: inputErrors.includes("pass1")
                            ? "#ffafcc"
                            : "white",
                    }}
                ></input>
                {showPasswordConfirmation && (
                    <>
                        <label htmlFor="pass2">Repeat Password</label>
                        <input
                            name="pass2"
                            id="pass2"
                            type={
                                showPasswordConfirmation ? "password" : "hidden"
                            }
                            minLength="3"
                            required
                            onChange={inputUpdate}
                            style={{
                                backgroundColor: error && "#ffafcc",
                            }}
                        ></input>
                    </>
                )}
                <div className="buttons">
                    <button onClick={handleSubmit}>Register</button>
                    <input
                        type="reset"
                        value="Reset"
                        id="reset"
                        onClick={() => {
                            setInputErrors([]);
                            setGeneralError(false);
                            setpassError(false);
                            setError(false);
                        }}
                    ></input>
                </div>

                <Link to="/login" id="login-link">
                    Click here to Log in!
                </Link>
            </form>
        </>
    );
}
