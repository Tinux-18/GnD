import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function NgoOverview() {
    useEffect(() => {
        console.log("NGO overview mounted");
    }, []);

    return (
        <div className="ngo-area">
            <menu>
                <h3>Registration status</h3>
                <h3></h3>
            </menu>
            <div className="ngo-area__main">
                <section>
                    <h2>Ong name</h2>
                </section>
                <section>
                    <h2>Donation Overview</h2>
                </section>
            </div>
        </div>
    );
}
