export default function Footer(props) {
    return (
        <footer>
            <p>© Tinux 2022</p>
            <div className="nav-right">
                <h3
                    className="welcome-link"
                    onClick={() => {
                        props.setShowMotivation(true);
                    }}
                >
                    Motivation
                </h3>
            </div>
        </footer>
    );
}
