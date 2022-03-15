import { useState, useEffect } from "react";

export default function FindUsers() {
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState([]);

    useEffect(() => {
        let abort;
        console.log(`"${query}" has been rendered!`);
        fetch(`/last_users.json?pattern=${query}`)
            .then((res) => res.json())
            .then((usersData) => {
                if (!abort) {
                    // console.log("usersData :>> ", usersData);
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
        <div className="find-users">
            <h2>Check out our newest leaders</h2>
            <div className="results">
                {users.length < 1 && <h3>We couldn&apos;t find anyone</h3>}
                {users.map((user) => (
                    <div key={user.id} className="result">
                        <a href={user.url}>
                            <img
                                className="result__img"
                                src={user.url}
                                alt={`${user.first} ${user.last}`}
                            ></img>
                        </a>
                        <a className="result__text" href={user.url}>
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
