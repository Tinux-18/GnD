import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateBio } from "../redux/app/slice";

export default function Bio() {
    const dispatch = useDispatch();
    const profile = useSelector((state) => state.app);
    const [inputError, setInputError] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [draftBio, setDraftBio] = useState();
    const [generalError, setGeneralError] = useState(false);

    useEffect(() => {
        console.log("Bio mounted");
    }, []);

    function handleSubmit() {
        if (!draftBio) {
            setInputError(true);
        } else {
            setInputError(false);
            postBio(draftBio);
        }
    }

    function postBio(inputBio) {
        fetch("/user/updateBio.json", {
            method: "POST",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify({
                bio: inputBio,
            }),
        })
            .then((res) => res.json())
            .then((postResponse) => {
                if (postResponse.success) {
                    setEditMode(false);
                    dispatch(updateBio(inputBio));
                } else {
                    setGeneralError(true);
                }
            })
            .catch((err) => {
                console.log(`fetch POST in bio failed with: ${err}`);
                setGeneralError(true);
            });
    }

    const editModeBio = (
        <>
            {generalError && (
                <h3 id="error">Something went wrong. Please try again!</h3>
            )}
            <textarea
                className="bio-input"
                defaultValue={profile.bio}
                onChange={(e) => setDraftBio(e.target.value)}
                style={{
                    backgroundColor: inputError ? "#ffafcc" : "white",
                }}
            ></textarea>
            <div className="buttons">
                <button onClick={handleSubmit}>Save</button>
                <button onClick={() => setEditMode(false)}>Cancel</button>
            </div>
        </>
    );

    const viewModeBio = (
        <>
            <p>{profile.bio}</p>
            <div className="buttons">
                <button onClick={() => setEditMode(true)}>Edit</button>
                <button onClick={() => postBio(null)}>Delete</button>
            </div>
        </>
    );

    const noBio = (
        <>
            <a onClick={() => setEditMode(true)}>Add your bio</a>
        </>
    );

    if (editMode) {
        return editModeBio;
    } else if (profile.bio) {
        return viewModeBio;
    } else {
        return noBio;
    }
}
