import { useEffect } from "react";

export default function Motivation(props) {
    useEffect(() => {
        console.log("Cards mounted");
    }, []);
    return (
        <>
            <div className="welcome_message">
                <h2>Why give a donation as a gift?</h2>
            </div>
            <div className="welcome" id="motivation__main">
                <div className="motivation__text">
                    <p>
                        A gift shows to the person that receives it that you
                        care and think about them.
                    </p>
                    <p>This is wonderful and should not go away!</p>
                    <p>
                        <strong>BUT </strong>
                        physical gifts come with a significant environmental
                        impact.
                    </p>
                    <p>
                        In the best scenario, the person that you care about
                        likes the gift. In a lot of cases, they do not,
                        resulting in waste being produced, even if they return
                        it.
                    </p>
                    <div className="separator"></div>
                    <p>
                        This is where we come in. We offer you the opportunity
                        to turn your physical gift into a donation to an
                        organisation of your choice.
                    </p>
                    <p>
                        Not only does this reduce your environmental impact
                        massively and shows the receiver that you care about
                        them, but also helps make our society a better place.
                    </p>
                    <h3
                        className="welcome-link"
                        onClick={() => {
                            props.setShowMotivation(false);
                        }}
                    >
                        Make a gift now!
                    </h3>
                </div>
            </div>
            <div className="welcome_message">
                <h2>Why register your organisation?</h2>
            </div>
            <div className="welcome" id="motivation__main">
                <div className="motivation__text-ngo">
                    <p>
                        We know how hard fundraising is. We&apos;ve been there.
                        We know that every cent counts.
                    </p>
                    <p>
                        This is why it is our goal to make registration as easy
                        as possible and allow even the smallest association
                        access to our platform.
                    </p>
                    <p>
                        After a quick verification by our team, donations will
                        flow into your account effortleslly.
                    </p>
                    <a href="/auth">
                        <h3 className="welcome-link">
                            Create an account and register your organisation
                            now!
                        </h3>
                    </a>
                </div>
            </div>
        </>
    );
}
