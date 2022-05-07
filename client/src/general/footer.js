import { useSelector } from "react-redux";

export default function Footer(props) {
    const app = useSelector((state) => state.app);
    return (
        <footer>
            <p>© Tinux 2022</p>
            <div className="nav-right">
                {app.isUserLoggedIn || (
                    <h3
                        className="welcome-link"
                        onClick={() => {
                            props.setShowMotivation(true);
                        }}
                    >
                        Motivation
                    </h3>
                )}
            </div>
        </footer>
    );
}
