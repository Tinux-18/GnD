import { useState, useEffect } from "react";
import { useStatefulFiles } from "../../hooks/update_stateful_files";

export default function NgoRegistrationDocuments(props) {
    const [generalError, setGeneralError] = useState(false);
    const [files, fileUpdate] = useStatefulFiles({});
    const [fileLinks, setFileLinks] = useState({});
    const [clear, setClear] = useState(false);

    useEffect(async () => {
        let abort;

        const data = await fetch("/ngo/profile.json").then((response) =>
            response.json()
        );

        if (!abort) {
            if (data) {
                setFileLinks({
                    statute: data.statute,
                    representativeId: data.representative_id,
                    logo: data.logo,
                });
            }
        }

        return () => {
            abort = true;
        };
    }, [clear]);

    function handleUpload(e) {
        e.preventDefault();

        if (Object.values(files).length !== 0) {
            const fd = new FormData();
            for (const file in files) {
                if (fileLinks[file] == null) {
                    fd.append(file, files[file]);
                }
            }

            fetch("/upload/documents.json", {
                method: "POST",
                body: fd,
            })
                .then((res) => res.json())
                .then(() => {
                    setClear(!clear);
                    location.reload();
                })
                .catch((err) => {
                    console.log(`fetch upload data failed with: ${err}`);
                    setGeneralError(true);
                });
        }
    }

    function handleDelete(type) {
        // should delete from AWS as well
        fetch("/upload/rempove-document.json", {
            method: "POST",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify({ documentType: type }),
        })
            .then((res) => res.json())
            .then(() => {
                setClear(!clear);
            })
            .catch((err) => {
                console.log(`fetch upload data failed with: ${err}`);
                setGeneralError(true);
            });
    }

    return (
        <div className="welcome">
            <form id="registration-form" className="form">
                <label htmlFor="registration-form">
                    <h3>Part 3: Uploads</h3>
                </label>
                {generalError && (
                    <h3 id="error">Something went wrong. Please try again!</h3>
                )}
                {fileLinks.statute ? (
                    <>
                        <div className="upload-box">
                            <a
                                id="file-link"
                                href={fileLinks.statute}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Current statute
                            </a>
                            <div>
                                <input
                                    className="file"
                                    type="file"
                                    name="statute"
                                    id="file-update"
                                    accept="application/pdf"
                                    required
                                    onChange={fileUpdate}
                                />
                                <label htmlFor="file-update" id="file-label">
                                    Update
                                </label>
                            </div>
                            <a
                                id="file-delete"
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => {
                                    handleDelete("statute");
                                }}
                            >
                                Delete
                            </a>
                        </div>
                    </>
                ) : (
                    <>
                        <input
                            className="file"
                            type="file"
                            name="statute"
                            id="statute"
                            accept="application/pdf"
                            required
                            onChange={fileUpdate}
                        />
                        <label htmlFor="statute" id="file-label">
                            Statute
                        </label>
                    </>
                )}

                {fileLinks.representativeId ? (
                    <>
                        <div className="upload-box">
                            <a
                                id="file-link"
                                href={fileLinks.representativeId}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Current ID
                            </a>
                            <div>
                                <input
                                    className="file"
                                    type="file"
                                    name="representativeId"
                                    id="representative-id"
                                    onChange={fileUpdate}
                                />
                                <label
                                    htmlFor="representative-id"
                                    id="file-label"
                                >
                                    Update
                                </label>
                            </div>
                            <a
                                id="file-delete"
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => {
                                    handleDelete("representativeId");
                                }}
                            >
                                Delete
                            </a>
                        </div>
                    </>
                ) : (
                    <>
                        <input
                            className="file"
                            type="file"
                            name="representativeId"
                            id="representative-id"
                            onChange={fileUpdate}
                        />
                        <label htmlFor="representative-id" id="file-label">
                            Identification Document
                        </label>
                    </>
                )}

                {fileLinks.logo ? (
                    <>
                        <div className="upload-box">
                            <a
                                id="file-link"
                                href={fileLinks.logo}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Logo
                            </a>
                            <div>
                                <input
                                    className="file"
                                    type="file"
                                    name="logo"
                                    id="logo"
                                    accept="image/*"
                                    onChange={fileUpdate}
                                />
                                <label htmlFor="logo" id="file-label">
                                    Update
                                </label>
                            </div>
                            <a
                                id="file-delete"
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => {
                                    handleDelete("logo");
                                }}
                            >
                                Delete
                            </a>
                        </div>
                    </>
                ) : (
                    <>
                        <input
                            className="file"
                            type="file"
                            name="logo"
                            id="logo"
                            accept="image/*"
                            onChange={fileUpdate}
                        />
                        <label htmlFor="logo" id="file-label">
                            Logo
                        </label>
                    </>
                )}
                <div className="buttons">
                    <button
                        type="submit"
                        onClick={() => {
                            props.prevSubform();
                        }}
                    >
                        Previous
                    </button>
                    <button type="submit" onClick={handleUpload}>
                        Upload
                    </button>
                </div>
            </form>
        </div>
    );
}
