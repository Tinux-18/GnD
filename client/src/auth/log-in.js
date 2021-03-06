import { useState, useEffect } from "react";

import { useStatefulFields } from "../hooks/update_stateful_fields";
import { useInputErrors } from "../hooks/validate_input";

export default function LogIn() {
    const [generalError, setGeneralError] = useState(false);
    const [inputErrors, setInputErrors] = useState([]);
    const [fields, inputUpdate] = useStatefulFields({ email: "", pass1: "" });

    useEffect(() => {
        console.log("LogIn mounted");
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setInputErrors([]);
        useInputErrors(["email", "pass1"], fields, setInputErrors);

        // Push data
        if (fields.email && fields.pass1) {
            fetch("/user/login", {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify({
                    email: fields.email,
                    pass: fields.pass1,
                }),
            })
                .then((res) => res.json())
                .then((postResponse) => {
                    if (postResponse.success) {
                        location.replace("/");
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

    return (
        <>
            <div className="form-style-5">
                <form id="login-form" className="form">
                    <label htmlFor="login-form" id="form-header">
                        <h2>Log in</h2>
                    </label>
                    {inputErrors.length != 0 && (
                        <h3 id="error">Please fill in the required fields</h3>
                    )}
                    {generalError && (
                        <h3 id="error">
                            Something went wrong. Please try again!
                        </h3>
                    )}
                    <label htmlFor="email">Email</label>
                    <input
                        name="email"
                        id="login_email"
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
                    <label htmlFor="pass1">Password</label>
                    <input
                        name="pass1"
                        id="login_pass1"
                        type="password"
                        minLength="3"
                        placeholder="***"
                        required
                        onChange={inputUpdate}
                        style={{
                            backgroundColor: inputErrors.includes("pass1")
                                ? "#ffafcc"
                                : "white",
                        }}
                    ></input>
                    <div className="login-buttons">
                        <button onClick={handleSubmit} type="submit">
                            Log in
                        </button>
                        <input
                            type="reset"
                            value="Clear"
                            onClick={() => {
                                setGeneralError(false);
                                setInputErrors([]);
                            }}
                        ></input>
                    </div>
                </form>
            </div>
        </>
    );
}
