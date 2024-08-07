import { useState, useEffect } from "react";
import { useStatefulFields } from "../../hooks/update_stateful_fields";
import { useInputErrors } from "../../hooks/validate_input";
import { formatDateForInputPopulation } from "../../utils/formatDate";

export default function NgoRegistrationLegal({
    ngoProfile,
    nextSubform,
    prevSubform,
}) {
    const [generalError, setGeneralError] = useState(false);
    const [inputErrors, setInputErrors] = useState([]);
    const [fields, inputUpdate, updateAll] = useStatefulFields({});
    const [legalRepresentativeCheck, setLegalRepresentativeCheck] =
        useState(false);
    const [legalRepresentativeError, setLegalRepresentativeError] =
        useState(false);
    const [clear, setClear] = useState(false);

    useEffect(async () => {
        let abort;

        if (!abort) {
            if (ngoProfile) {
                updateAll({
                    legal_name: ngoProfile.legal_name,
                    registration_number: ngoProfile.registration_number,
                    county: ngoProfile.county,
                    street: ngoProfile.street,
                    extra_address: ngoProfile.extra_address,
                    founding_date: ngoProfile.founding_date,
                    funds: ngoProfile.funds,
                    bank: ngoProfile.bank,
                    iban: ngoProfile.iban,
                    bic: ngoProfile.bic,
                });
            }
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
            (field) => !field
        );

        setInputErrors([]);
        useInputErrors(
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
                        nextSubform();
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
                    <h3>Part 2: Legal information</h3>
                </label>
                {inputErrors.length != 0 && (
                    <h3 id="error">Please fill in the required fields</h3>
                )}
                {legalRepresentativeError && inputErrors.length == 0 && (
                    <h3 id="error">
                        Only legal representatives can register an organisation.
                        If you do so, your registration will be rejected.
                    </h3>
                )}
                {generalError && inputErrors.length == 0 && (
                    <h3 id="error">Something went wrong. Please try again!</h3>
                )}
                <label htmlFor="legal_name">Legal name</label>
                <input
                    name="legal_name"
                    id="legal_name"
                    type="text"
                    value={fields.legal_name ? fields.legal_name : ""}
                    maxLength="255"
                    placeholder="Asociația Code for Romania"
                    onChange={inputUpdate}
                    style={{
                        backgroundColor: inputErrors.includes("display_name")
                            ? "#ffafcc"
                            : "white",
                    }}
                ></input>
                <label htmlFor="registration_number">Registration number</label>
                <input
                    name="registration_number"
                    id="registration_number"
                    type="text"
                    value={
                        fields.registration_number
                            ? fields.registration_number
                            : ""
                    }
                    maxLength="255"
                    placeholder="1249/A/2020"
                    onChange={inputUpdate}
                    style={{
                        backgroundColor: inputErrors.includes(
                            "registration_number"
                        )
                            ? "#ffafcc"
                            : "white",
                    }}
                ></input>
                <label htmlFor="county">County</label>
                <input
                    name="county"
                    id="county"
                    value={fields.county ? fields.county : ""}
                    type="text"
                    maxLength="255"
                    placeholder="Bucuresti"
                    onChange={inputUpdate}
                    style={{
                        backgroundColor: inputErrors.includes("county")
                            ? "#ffafcc"
                            : "white",
                    }}
                ></input>
                <label htmlFor="street">Street</label>
                <input
                    name="street"
                    id="street"
                    value={fields.street ? fields.street : ""}
                    type="text"
                    maxLength="255"
                    placeholder="Piața Alba Iulia"
                    onChange={inputUpdate}
                    style={{
                        backgroundColor: inputErrors.includes("street")
                            ? "#ffafcc"
                            : "white",
                    }}
                ></input>
                <label htmlFor="extra_address">Address adition</label>
                <input
                    name="extra_address"
                    id="extra_address"
                    value={fields.extra_address ? fields.extra_address : ""}
                    type="text"
                    placeholder="bloc I6, etaj 1, ap. 6"
                    required
                    onChange={inputUpdate}
                    style={{
                        backgroundColor: inputErrors.includes("extra_address")
                            ? "#ffafcc"
                            : "white",
                    }}
                ></input>
                <label htmlFor="founding_date">Founding date</label>
                <input
                    name="founding_date"
                    id="founding_date"
                    value={
                        fields.founding_date
                            ? formatDateForInputPopulation(fields.founding_date)
                            : ""
                    }
                    type="date"
                    required
                    onChange={inputUpdate}
                    style={{
                        backgroundColor: inputErrors.includes("founding_date")
                            ? "#ffafcc"
                            : "white",
                    }}
                ></input>
                <label htmlFor="funds">Equity</label>
                <input
                    name="funds"
                    id="funds"
                    value={fields.funds ? fields.funds : ""}
                    type="number"
                    placeholder="400000"
                    required
                    onChange={inputUpdate}
                    style={{
                        backgroundColor: inputErrors.includes("funds")
                            ? "#ffafcc"
                            : "white",
                    }}
                ></input>
                <label htmlFor="bank">Bank Name</label>
                <input
                    name="bank"
                    id="bank"
                    value={fields.bank ? fields.bank : ""}
                    type="text"
                    placeholder="BRD"
                    required
                    onChange={inputUpdate}
                    style={{
                        backgroundColor: inputErrors.includes("bank")
                            ? "#ffafcc"
                            : "white",
                    }}
                ></input>
                <label htmlFor="iban">IBAN</label>
                <input
                    name="iban"
                    id="iban"
                    value={fields.iban ? fields.iban : ""}
                    type="text"
                    placeholder="RO5161321651651616"
                    required
                    onChange={inputUpdate}
                    style={{
                        backgroundColor: inputErrors.includes("iban")
                            ? "#ffafcc"
                            : "white",
                    }}
                ></input>
                <label htmlFor="bic">BIC</label>
                <input
                    name="bic"
                    id="bic"
                    value={fields.bic ? fields.bic : ""}
                    type="text"
                    placeholder="COBADEFFXXX"
                    required
                    onChange={inputUpdate}
                    style={{
                        backgroundColor: inputErrors.includes("bic")
                            ? "#ffafcc"
                            : "white",
                    }}
                ></input>
                <div className="checkbox-div">
                    <label htmlFor="legalRepresentativeCheck">
                        I am one of the legal representatives.
                    </label>
                    <input
                        type="checkbox"
                        id="legalRepresentativeCheck"
                        name="legalRepresentativeCheck"
                        onChange={(e) =>
                            setLegalRepresentativeCheck(e.target.checked)
                        }
                    ></input>
                </div>
                <div className="buttons">
                    <button
                        type="submit"
                        onClick={() => {
                            prevSubform();
                        }}
                    >
                        Previous
                    </button>
                    <input
                        type="reset"
                        value="Reset"
                        onClick={() => {
                            setInputErrors([]);
                            setGeneralError(false);
                            setLegalRepresentativeError(false);
                            setClear(true);
                        }}
                    ></input>
                    <button onClick={handleNext} type="submit">
                        Next
                    </button>
                </div>
            </form>
        </div>
    );
}
