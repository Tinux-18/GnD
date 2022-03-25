import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateImage, toggleUploader } from "../redux/app/slice";
// TODO
// - close with esc
// - close with click outside

export default function Uploader() {
    const dispatch = useDispatch();
    const [generalError, setGeneralError] = useState(false);
    const [file, setFile] = useState();

    useEffect(() => {
        console.log("Uploader mounted");
    }, []);

    function handleUpload(e) {
        e.preventDefault();

        const fd = new FormData();
        fd.append("file", file);

        fetch("/upload/profile_pic.json", {
            method: "POST",
            body: fd,
        })
            .then((res) => res.json())
            .then((uploadData) => {
                dispatch(updateImage(uploadData.image));
                dispatch(toggleUploader(false));
            })
            .catch((err) => {
                console.log(`fetch upload data failed with: ${err}`);
                setGeneralError(true);
            });
    }

    return (
        <div className="uploader">
            <img
                src="/close_button2.png"
                alt="close uploader button"
                className="close-button"
                onClick={() => dispatch(toggleUploader(false))}
            ></img>
            {generalError && (
                <h3 id="error">Something went wrong. Please try again!</h3>
            )}
            <form className="upload-form" onSubmit={handleUpload}>
                <div>
                    <input
                        type="file"
                        name="file"
                        id="file"
                        accept="image/*"
                        required
                        onChange={(e) => {
                            setFile(e.target.files[0]);
                        }}
                    />
                    <label htmlFor="file" id="file-label">
                        Your best pic
                    </label>
                </div>
                <button>Upload</button>
            </form>
        </div>
    );
}
