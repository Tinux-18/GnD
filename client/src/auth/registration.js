import { useState, useEffect } from "react";
import { useStatefulFields } from "../hooks/update_stateful_fields";
import { useInputErrors } from "../hooks/validate_input";

export default function SignIn() {
    const [generalError, setGeneralError] = useState(false);
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
    const [ngoCheck, setNgoCheck] = useState(false);

    useEffect(() => {
        console.log("Registration mounted");
    }, []);

    const showConfirmPassword = (e) =>
        setShowPasswordConfirmation(
            !(e.target.value.length <= 1 && e.code == "Backspace")
        );

    const arePasswordsDifferent = () => {
        if (fields.pass1 !== fields.pass2) {
            setpassError(true);
            return true;
        } else {
            setpassError(false);
            return false;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setInputErrors([]);
        useInputErrors(
            ["first", "second", "email", "pass1"],
            fields,
            setInputErrors
        );

        // Push data

        let noEmptyFields = !Object.values(fields).some(
            (field) => field.length == 0
        );
        if (noEmptyFields && !arePasswordsDifferent()) {
            const role = ngoCheck ? "organiser" : "donor";

            fetch("/user/addProfile.json", {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify({ ...fields, role: role }),
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
        } else {
            setGeneralError(true);
        }
    };

    return (
        <>
            <form id="registration-form" className="form">
                <label htmlFor="registration-form">
                    <h2>Register</h2>
                </label>
                {inputErrors.length != 0 && (
                    <h3 id="error">Please fill in the required fields</h3>
                )}
                {generalError && inputErrors.length == 0 && (
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
                    id="registration_email"
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
                    id="registration_pass1"
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
                                backgroundColor: passError && "#ffafcc",
                            }}
                        ></input>
                    </>
                )}
                <div>
                    <input
                        type="checkbox"
                        id="ngo-check"
                        name="ngoCheck"
                        onChange={(e) => setNgoCheck(e.target.checked)}
                    ></input>
                    <label htmlFor="ngo-check">Also register a NGO</label>
                </div>
                <div className="buttons">
                    <button onClick={handleSubmit}>Register</button>
                    <input
                        type="reset"
                        value="Clear"
                        onClick={() => {
                            setInputErrors([]);
                            setGeneralError(false);
                            setpassError(false);
                        }}
                    ></input>
                </div>
            </form>
        </>
    );
}
