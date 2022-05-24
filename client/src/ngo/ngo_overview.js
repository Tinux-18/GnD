import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Table from "./table";
import styled from "styled-components";

export default function NgoOverview() {
    const ngoProfile = useSelector((state) => state.ngo);
    const [donations, setDonations] = useState();
    const [update, setUpdate] = useState(false);
    const [generalError, setGeneralError] = useState(false);
    const [showExpandButton, setShowExpandButton] = useState(true);
    const [sum, setSum] = useState();

    useEffect(async () => {
        const data = await fetch(
            `/donation/current-donations.json?ngo_id=${ngoProfile.id}&limit=5`
        ).then((response) => response.json());
        setDonations(data);
        setSum(sumDonations(data));
    }, [update]);

    function handleClick({ target }) {
        fetch("/donation/update-donation-status.json", {
            method: "POST",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify({
                id: target.id,
            }),
        })
            .then((res) => res.json())
            .then((postResponse) => {
                if (postResponse.success) {
                    setUpdate(!update);
                } else {
                    setGeneralError(true);
                }
            })
            .catch((err) => {
                console.log(
                    `fetch /donation/update-donation-status.json failed with: ${err}`
                );
                setGeneralError(true);
            });
    }

    async function expandDonations() {
        const data = await fetch(
            `/donation/current-donations.json?ngo_id=${ngoProfile.id}&limit=1000`
        ).then((response) => response.json());
        setDonations(data);
        setSum(sumDonations(data));
        setShowExpandButton(false);
    }

    function sumDonations(donations) {
        let donationsSum = 0;
        for (const donation in donations) {
            if (Object.hasOwnProperty.call(donations, donation)) {
                donationsSum += parseInt(donations[donation].amount);
            }
        }
        return donationsSum;
    }

    if (!ngoProfile && !donations) {
        return null;
    }

    const table = (
        <>
            <h3>Donation overview</h3>
            {generalError && (
                <h3 id="error">Something went wrong. Please try again!</h3>
            )}
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Accept</th>
                    </tr>
                </thead>
                <tbody>
                    {donations &&
                        donations.map((donation, key) => {
                            return (
                                <tr key={key}>
                                    <td>{donation.created_at}</td>
                                    <td>€{donation.amount}</td>
                                    <td>{donation.status}</td>
                                    <td>{donation.donnor_name}</td>
                                    <td>{donation.email}</td>
                                    <td>
                                        {!donation.accepted ? (
                                            <input
                                                type="checkbox"
                                                id={donation.id}
                                                name="accept-donation"
                                                onChange={handleClick}
                                                defaultChecked={
                                                    donation.accepted
                                                }
                                            ></input>
                                        ) : (
                                            <input
                                                type="checkbox"
                                                id={donation.id}
                                                name="accept-donation"
                                                checked={true}
                                                readOnly={true}
                                            ></input>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    <tr id="sum-row">
                        <th>Sum</th>
                        <th>€{sum}</th>
                    </tr>
                </tbody>
            </table>
            {showExpandButton && (
                <button onClick={expandDonations} id="see-all">
                    See all
                </button>
            )}
        </>
    );
    return (
        <div className="ngo-area__main">
            {donations && donations.length != 0 ? (
                table
            ) : (
                <h4>No donations for now</h4>
            )}
            {!ngoProfile.display_name && (
                <a href="#" className="welcome-link">
                    <h4>Register your orgnisation to receive some</h4>
                </a>
            )}
        </div>
    );
}
