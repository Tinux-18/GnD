import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { receiveNgoProfile } from "../redux/ngo/slice";
import NgoRegistrationBasic from "./ngo_registration_basic";
import NgoRegistrationLegal from "./ngo_registration_legal";
import NgoRegistrationDocuments from "./ngo_registration_documents";
import Logo from "../general/logo";
import ProfilePic from "../general/profile_pic";

export default function NgoRegistration() {
    const [generalError, setGeneralError] = useState(false);
    const [subForm, setSubForm] = useState();
    const dispatch = useDispatch();
    const ngoProfile = useSelector((state) => state.ngo);

    useEffect(async () => {
        console.log("Ngo registration mounted");
        let abort;

        dispatch(receiveNgoProfile());

        if (subForm) {
            fetch("/ngo/store-registration-part.json", {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify({ registrationPart: subForm }),
            }).catch((err) => {
                if (!abort) {
                    console.log(
                        `fetch /ngo/store-registration-part.json failed with: ${err}`
                    );
                    setGeneralError(true);
                }
            });
        } else {
            const data = await fetch("/ngo/registration-part.json").then(
                (response) => response.json()
            );
            if (!abort) {
                setSubForm(data.registrationPart);
            }
        }

        return () => {
            abort = true;
        };
    }, [subForm]);

    if (!ngoProfile) {
        return null;
    }

    return (
        <>
            <div className="welcome form">
                {ngoProfile.display_name ? (
                    <h2 onClick={() => setSubForm(1)}>Edit your profile</h2>
                ) : (
                    <>
                        <h2 onClick={() => setSubForm(1)}>
                            Register your organisation
                        </h2>

                        <p className="note">
                            Please fill in the four sections of our form
                        </p>
                    </>
                )}

                {generalError && (
                    <h3 id="error">Something went wrong. Please try again!</h3>
                )}
                {subForm == 1 && (
                    <NgoRegistrationBasic
                        nextSubform={() => setSubForm(subForm + 1)}
                        ngoProfile={ngoProfile}
                    />
                )}
                {subForm == 2 && (
                    <NgoRegistrationLegal
                        nextSubform={() => setSubForm(subForm + 1)}
                        prevSubform={() => setSubForm(subForm - 1)}
                        ngoProfile={ngoProfile}
                    />
                )}
                {subForm == 3 && (
                    <NgoRegistrationDocuments
                        prevSubform={() => setSubForm(subForm - 1)}
                        ngoProfile={ngoProfile}
                    />
                )}
            </div>
        </>
    );
}
