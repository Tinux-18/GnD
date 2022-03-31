import { useState, useEffect } from "react";
import { useStatefulFields } from "../hooks/update_stateful_fields";
import { validateInput } from "../hooks/validate_input";

export default function NgoRegistrationDocuments(props) {
    const [generalError, setGeneralError] = useState(false);
    const [inputErrors, setInputErrors] = useState([]);
    const [fields, fileUpdate, updateAll] = useStatefulFields({});
    const [clear, setClear] = useState(false);
    const [file, setFile] = useState();

    useEffect(async () => {
        let abort;

        if (!abort) {
            const data = await fetch("/ngo/profile.json").then((response) =>
                response.json()
            );
        }
        return () => {
            abort = true;
        };
    }, [clear]);

    const handleNext = async (e) => {
        e.preventDefault();

        const requiredFields = { ...fields };
        delete requiredFields.extra_address;
        let noEmptyFields = !Object.values(requiredFields).some(
            (field) => field.length == 0
        );
        setInputErrors([]);
        validateInput(
            Object.keys(requiredFields),
            requiredFields,
            setInputErrors
        );

        if (!legalRepresentativeCheck) {
            setLegalRepresentativeError(true);
        }

        if (noEmptyFields && legalRepresentativeCheck) {
            fetch("/ngo/update-legal-profile.json", {
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
    function handleUpload(e) {
        e.preventDefault();
        console.log("UPLOAD FILES");

        const fd = new FormData();
        for (const file in fields) {
            if (Object.hasOwnProperty.call(fields, file)) {
                fd.append(file, fields[file]);
            }
        }

        fetch("/upload/documents.json", {
            method: "POST",
            body: fd,
        })
            .then((res) => res.json())
            .then((uploadData) => {
                console.log("uploadData :>> ", uploadData);
            })
            .catch((err) => {
                console.log(`fetch upload data failed with: ${err}`);
                setGeneralError(true);
            });
    }

    return (
        <div className="welcome">
            <form
                id="registration-form"
                className="form"
                onSubmit={handleUpload}
            >
                <label htmlFor="registration-form">
                    <h3>Part 3: Uploads</h3>
                </label>
                {inputErrors.length != 0 && (
                    <h3 id="error">Please fill in the required fields</h3>
                )}
                {generalError && inputErrors.length == 0 && (
                    <h3 id="error">Something went wrong. Please try again!</h3>
                )}
                <input
                    className="file"
                    type="file"
                    name="statute"
                    id="statute"
                    accept="application/pdf"
                    required
                    onChange={fileUpdate}
                />
                <label htmlFor="statute" id="file-label">
                    Statute
                </label>
                <input
                    className="file"
                    type="file"
                    name="representativeId"
                    id="representative-id"
                    onChange={fileUpdate}
                />
                <label htmlFor="representative-id" id="file-label">
                    Identification Document
                </label>
                <input
                    className="file"
                    type="file"
                    name="logo"
                    id="logo"
                    accept="image/*"
                    onChange={fileUpdate}
                />
                <label htmlFor="logo" id="file-label">
                    Logo
                </label>
                <div className="buttons">
                    <button
                        onClick={() => {
                            props.prevSubform();
                        }}
                    >
                        Previous
                    </button>
                    <button>Upload</button>
                </div>
                <input
                    type="reset"
                    value="Reset"
                    onClick={() => {
                        setInputErrors([]);
                        setGeneralError(false);
                        setClear(true);
                    }}
                ></input>
            </form>
        </div>
    );
}
