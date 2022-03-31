import { useState, useEffect } from "react";
import NgoRegistrationBasic from "./ngo_registration_basic";
import NgoRegistrationLegal from "./ngo_registration_legal";
import NgoRegistrationDocuments from "./ngo_registration_documents";

export default function NgoRegistration() {
    const [generalError, setGeneralError] = useState(false);
    const [subForm, setSubForm] = useState();

    useEffect(async () => {
        console.log("Ngo registration mounted");
        let abort;

        if (!abort) {
            if (subForm) {
                fetch("/ngo/store-registration-part.json", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                    },
                    body: JSON.stringify({ registrationPart: subForm }),
                }).catch((err) => {
                    console.log(
                        `fetch /ngo/store-registration-part.json failed with: ${err}`
                    );
                    setGeneralError(true);
                });
            } else {
                const data = await fetch("/ngo/registration-part.json").then(
                    (response) => response.json()
                );
                setSubForm(data.registrationPart);
            }
        }

        return () => {
            abort = true;
        };
    }, [subForm]);

    return (
        <div className="welcome form">
            <h2>Register your organisation</h2>
            <p className="note">Please fill in the four sections of our form</p>
            {generalError && (
                <h3 id="error">Something went wrong. Please try again!</h3>
            )}
            {subForm == 1 && (
                <NgoRegistrationBasic
                    nextSubform={() => setSubForm(subForm + 1)}
                />
            )}
            {subForm == 2 && (
                <NgoRegistrationLegal
                    nextSubform={() => setSubForm(subForm + 1)}
                    prevSubform={() => setSubForm(subForm - 1)}
                />
            )}
            {subForm == 3 && (
                <NgoRegistrationDocuments
                    prevSubform={() => setSubForm(subForm - 1)}
                />
            )}
        </div>
    );
}
