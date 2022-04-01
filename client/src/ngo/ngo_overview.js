import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Table from "./table";
import styled from "styled-components";

export default function NgoOverview() {
    const ngoProfile = useSelector((state) => state.ngo);
    const [donations, setDonations] = useState();
    const [update, setUpdate] = useState(false);
    const [generalError, setGeneralError] = useState(false);

    useEffect(async () => {
        const data = await fetch(
            `/donation/current-donations.json?ngo_id=${ngoProfile.id}&limit=5`
        ).then((response) => response.json());
        setDonations(data);
    }, [update]);

    function handleClick({ target }) {
        console.log("target :>> ", target.id);
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
    }

    if (!ngoProfile && !donations) {
        return null;
    }
    const Styles = styled.div`
        table {
            border-spacing: 0;
            border: 1px solid black;

            tr {
                :last-child {
                    td {
                        border-bottom: 0;
                    }
                }
            }

            th,
            td {
                margin: 0;
                padding: 0.5rem;
                border-bottom: 1px solid black;
                border-right: 1px solid black;

                :last-child {
                    border-right: 0;
                }
            }
        }
    `;
    return (
        <div className="ngo-area__main">
            <section>
                <h2>{ngoProfile.display_name}</h2>
                <h3>Donation overview</h3>
                {generalError && (
                    <h3 id="error">Something went wrong. Please try again!</h3>
                )}
            </section>
            <Styles>
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
                                        <td>{donation.amount}</td>
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
                    </tbody>
                </table>
            </Styles>
            <button onClick={expandDonations}>See all</button>
        </div>
    );
}
