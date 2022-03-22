import { useStatefulFields } from "../hooks/useStatefulFields";
import { useState, useEffect } from "react";

export default function ResetPass() {
    const [fields, inputUpdate] = useStatefulFields({
        email: "",
        pass1: "",
        code: "",
    });
    const [showPassResetForm, setPassResetForm] = useState(false);

    useEffect(() => {
        console.log("Reset password mounted");
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (fields.email) {
            fetch("/user/reset-password", {
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
                    console.log("postResponse :>> ", postResponse);
                    // if (postResponse.success) {
                    //     location.replace("\\");
                    // } else {
                    //     setGeneralError(true);
                    // }
                })
                .catch((err) => {
                    console.log(
                        `fetch POST in reset password failed with: ${err}`
                    );
                });
        }
    };

    const sendRequestForm = (
        <>
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
        </>
    );

    const resetPasswordForm = (
        <>
            <label htmlFor="code">Enter the code you received</label>
            <input
                name="code"
                id="code"
                type="text"
                maxLength="255"
                placeholder="saf3234f"
                onChange={inputUpdate}
                required
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
        </>
    );

    return (
        <>
            <form id="reset-password-form" className="form">
                <label htmlFor="reset-password-form">
                    <h2>Reset your password</h2>
                </label>
                {showPassResetForm ? resetPasswordForm : sendRequestForm}
                <button onClick={handleSubmit}>Submit</button>
            </form>
        </>
    );
}

// if email is not in DB, show a new module confirming email sent

// if email is in DB, verification code is sent
