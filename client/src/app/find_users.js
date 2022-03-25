import { useState, useEffect } from "react";
export default function FindUsers() {
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState([]);

    useEffect(() => {
        let abort;
        fetch(`/last_users.json?pattern=${query}`)
            .then((res) => res.json())
            .then((usersData) => {
                if (!abort) {
                    setUsers(usersData);
                }
            })
            .catch((err) =>
                console.log(`fetch last users failed with: ${err}`)
            );
        return () => {
            abort = true;
        };
    }, [query]);
    return (
        <div className="component-container">
            <h2>Check out our newest leaders</h2>
            <div className="results">
                {users.length < 1 && <h3>We couldn&apos;t find anyone</h3>}
                {users.map((user) => (
                    <div key={user.id} className="result">
                        {user.image && (
                            <a href={`/other-user/:${user.id}`}>
                                <img
                                    className="result__img"
                                    src={user.image}
                                    alt={`${user.first} ${user.last}`}
                                ></img>
                            </a>
                        )}
                        <a
                            className="result__text"
                            href={`/other-user/:${user.id}`}
                        >
                            {user.first} {user.last}
                        </a>
                    </div>
                ))}
            </div>
            <h3>Looking for someone in particular?</h3>
            <input onChange={(e) => setQuery(e.target.value)} />
        </div>
    );
}
