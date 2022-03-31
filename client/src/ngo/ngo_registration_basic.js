import { useState, useEffect } from "react";
import { useStatefulFields } from "../hooks/update_stateful_fields ";
import { validateInput } from "../hooks/validate_input";

export default function NgoRegistrationBasic(props) {
    const [generalError, setGeneralError] = useState(false);
    const [inputErrors, setInputErrors] = useState([]);
    const [fields, inputUpdate, updateAll] = useStatefulFields({});

    useEffect(async () => {
        const data = await fetch("/ngo/profile.json").then((response) =>
            response.json()
        );

        if (data.rows[0]) {
            updateAll({
                display_name: data.rows[0].display_name,
                description: data.rows[0].description,
                facebook: data.rows[0].facebook,
                website: data.rows[0].website,
                contact_email: data.rows[0].contact_email,
                instagram: data.rows[0].instagram,
                tiktok: data.rows[0].tiktok,
            });
        }
    }, []);

    const handleNext = (e) => {
        e.preventDefault();
        setInputErrors([]);
        validateInput(
            ["display_name", "description", "facebook"],
            fields,
            setInputErrors
        );

        if (fields.display_name && fields.description && fields.facebook) {
            fetch("/ngo/upsert-profile.json", {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify(fields),
            })
                .then((res) => res.json())
                .then((postResponse) => {
                    if (postResponse.success) {
                        props.nextSubform();
                    } else {
                        setGeneralError(true);
                    }
                })
                .catch((err) => {
                    console.log(
                        `fetch POST in ngo_registration_basic failed with: ${err}`
                    );
                    setGeneralError(true);
                });
        }
    };
    return (
        <div className="welcome">
            <form id="registration-form" className="form">
                <label htmlFor="registration-form">
                    <h3>Part 1: Essential information</h3>
                    <p className="note">*You can edit this later</p>
                </label>
                {inputErrors.length != 0 && (
                    <h3 id="error">Please fill in the required fields</h3>
                )}
                {generalError && inputErrors.length == 0 && (
                    <h3 id="error">Something went wrong. Please try again!</h3>
                )}
                <label htmlFor="display_name">
                    Name to be displayed on the platform
                </label>
                <input
                    name="display_name"
                    id="display_name"
                    value={fields.display_name ? fields.display_name : ""}
                    type="text"
                    maxLength="255"
                    placeholder="Code 4 Romania"
                    onChange={inputUpdate}
                    style={{
                        backgroundColor: inputErrors.includes("display_name")
                            ? "#ffafcc"
                            : "white",
                    }}
                ></input>
                <label htmlFor="website">Website</label>
                <input
                    name="website"
                    id="website"
                    value={fields.website ? fields.website : ""}
                    type="text"
                    maxLength="255"
                    placeholder="https://code4.ro/"
                    onChange={inputUpdate}
                    style={{
                        backgroundColor: "white",
                    }}
                ></input>
                <label htmlFor="contact_email">Contact email</label>
                <input
                    name="contact_email"
                    id="contact_email"
                    type="email"
                    value={fields.contact_email ? fields.contact_email : ""}
                    maxLength="255"
                    placeholder="contact@code4.ro"
                    onChange={inputUpdate}
                    style={{
                        backgroundColor: "white",
                    }}
                ></input>
                <label htmlFor="facebook">Facebook</label>
                <input
                    name="facebook"
                    id="facebook"
                    type="text"
                    value={fields.facebook ? fields.facebook : ""}
                    placeholder="@code4romania"
                    required
                    onChange={inputUpdate}
                    style={{
                        backgroundColor: inputErrors.includes("facebook")
                            ? "#ffafcc"
                            : "white",
                    }}
                ></input>
                <label htmlFor="instagram">Instagram</label>
                <input
                    name="instagram"
                    id="instagram"
                    type="text"
                    placeholder="@code4romania"
                    value={fields.instagram ? fields.instagram : ""}
                    onChange={inputUpdate}
                    style={{
                        backgroundColor: "white",
                    }}
                ></input>
                <label htmlFor="tiktok">TikTok</label>
                <input
                    name="tiktok"
                    id="tiktok"
                    type="text"
                    placeholder="@code4romania"
                    value={fields.tiktok ? fields.tiktok : ""}
                    onChange={inputUpdate}
                    style={{
                        backgroundColor: "white",
                    }}
                ></input>
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    className="bio-input"
                    value={fields.description ? fields.description : ""}
                    onChange={inputUpdate}
                    style={{
                        backgroundColor: inputErrors.includes("description")
                            ? "#ffafcc"
                            : "white",
                    }}
                ></textarea>
                <div className="buttons">
                    <button onClick={handleNext}>Next</button>
                </div>
                <input
                    type="reset"
                    value="Reset"
                    onClick={() => {
                        setInputErrors([]);
                        setGeneralError(false);
                    }}
                ></input>
            </form>
        </div>
    );
}
