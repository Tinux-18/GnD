import { Component } from "react";
export default class Bio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editMode: false,
            draftBio: "",
            inputError: false,
            generalError: false,
        };
        this.inputUpdate = this.inputUpdate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.postBio = this.postBio.bind(this);
    }
    componentDidMount() {
        console.log("Bio mounted");
    }
    inputUpdate({ target }) {
        this.setState({ draftBio: target.value }, () => {});
    }
    handleSubmit() {
        if (!this.state.draftBio) {
            this.setState({ inputError: true });
        } else {
            this.setState({ inputError: false });
            this.postBio(this.state.draftBio);
        }
    }
    postBio(inputBio) {
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
                    this.setState({ editMode: false });
                    this.props.updateBio(inputBio);
                } else {
                    this.setState({ generalError: true });
                }
            })
            .catch((err) => {
                console.log(`fetch POST in bio failed with: ${err}`);
                this.setState({ generalError: true });
            });
    }
    render() {
        if (this.state.editMode) {
            return (
                <>
                    {this.state.generalError && (
                        <h3 id="error">
                            Something went wrong. Please try again!
                        </h3>
                    )}
                    <textarea
                        className="bio-input"
                        defaultValue={this.props.bio}
                        onChange={this.inputUpdate}
                        style={{
                            backgroundColor: this.state.inputError
                                ? "#ffafcc"
                                : "white",
                        }}
                    ></textarea>
                    <div className="buttons">
                        <button onClick={this.handleSubmit}>Save</button>
                        <button
                            onClick={() => {
                                this.setState({ editMode: false });
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </>
            );
        } else if (this.props.bio) {
            return (
                <>
                    <p>{this.props.bio}</p>
                    <div className="buttons">
                        <button
                            onClick={() => {
                                this.setState({ editMode: true });
                            }}
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => {
                                this.postBio(null);
                            }}
                        >
                            Delete
                        </button>
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <a
                        onClick={() => {
                            this.setState({ editMode: true });
                        }}
                    >
                        Add your bio
                    </a>
                </>
            );
        }
    }
}
