import { useEffect } from "react";

export default function Cards() {
    useEffect(() => {
        console.log("Cards mounted");
    }, []);
    return (
        <>
            <div className="welcome_message">
                <h2>Choose a card and make a gift that matters</h2>
            </div>
            <div className="welcome" id="cards">
                <a href="/shopping/:christmas.jpg">
                    <img alt="christmas card" src="/cards/christmas.jpg" />
                </a>
                <a href="/shopping/:thank-you.webp">
                    <img alt="thank you card" src="cards/thank-you.webp" />
                </a>
            </div>
        </>
    );
}
