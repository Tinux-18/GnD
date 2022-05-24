import { useStatefulFields } from "../hooks/update_stateful_fields";
import { useState, useEffect } from "react";

export default function ResetPass({ showPassReset, setShowPassReset }) {
    const [fields, inputUpdate] = useStatefulFields({
        email: "",
        pass1: "",
        code: "",
    });
    const [userId, setUserId] = useState();
    const [showPassResetForm, setShowPassResetForm] = useState(false);
    const [generalError, setGeneralError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        console.log("Reset password mounted");
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (e.target.name == "sendRequestForm" && fields.email) {
            fetch("/user/reset-password.json", {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify({
                    email: fields.email,
                }),
            })
                .then((res) => res.json())
                .then((postResponse) => {
                    setUserId(postResponse.userId);
                    setShowPassResetForm(postResponse.success);
                })
                .catch((err) => {
                    console.log(
                        `fetch POST in reset password failed with: ${err}`
                    );
                    setGeneralError(true);
                });
        } else if (
            e.target.name == "resetPasswordForm" &&
            fields.pass1 &&
            fields.code
        ) {
            fetch("/user/update-password.json", {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify({
                    userId: userId,
                    email: fields.email,
                    password: fields.pass1,
                    code: fields.code,
                }),
            })
                .then((res) => res.json())
                .then((postResponse) => {
                    setShowSuccess(postResponse.success);
                })
                .catch((err) => {
                    console.log(`fetch update-password failed with: ${err}`);
                    setGeneralError(true);
                });
        } else {
            setGeneralError(true);
        }
    };

    const sendRequestForm = (
        <>
            <label htmlFor="reset-password-form">
                <h2>Reset your password</h2>
            </label>
            {generalError && (
                <h3 id="error">Something went wrong. Please try again!</h3>
            )}
            <label htmlFor="email">Email</label>
            <input
                name="email"
                id="email"
                type="email"
                maxLength="255"
                placeholder="miha.dragan@tnb.ro"
                onChange={inputUpdate}
                required
            ></input>
            <button name="sendRequestForm" onClick={handleSubmit} type="submit">
                Submit
            </button>
        </>
    );

    const resetPasswordForm = (
        <>
            <label htmlFor="reset-password-form">
                <h2>Reset your password</h2>
            </label>
            {generalError && (
                <h3 id="error">Something went wrong. Please try again!</h3>
            )}
            <label htmlFor="code">Enter the code you received</label>
            <input
                name="code"
                id="code"
                type="text"
                maxLength="255"
                placeholder="saf3234f"
                onChange={inputUpdate}
            ></input>
            <label htmlFor="pass1">Enter a new password</label>
            <input
                name="pass1"
                id="pass1"
                type="password"
                minLength="3"
                placeholder="***"
                required
                onChange={inputUpdate}
            ></input>
            <button
                name="resetPasswordForm"
                onClick={handleSubmit}
                type="submit"
            >
                Submit
            </button>
        </>
    );

    const successMessage = (
        <>
            <h2 style={{ "align-self": "center" }}>Success!!!</h2>
            <a
                href="#"
                className="welcome-link"
                onClick={() => {
                    setShowPassReset(!showPassReset);
                }}
            >
                <h3>Log in</h3>
            </a>
        </>
    );

    return (
        <>
            <div className="form-style-5">
                <form id="reset-password-form" className="form">
                    {/* TODO Turn into ternary */}
                    {showPassResetForm && !showSuccess && resetPasswordForm}
                    {!showPassResetForm && !showSuccess && sendRequestForm}

                    {showSuccess && successMessage}
                </form>
            </div>
        </>
    );
}
