import { Component } from "react";
// TODO
// - close with esc
// - close with click outside
export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = { error: false, generalError: false };
        this.handleUpload = this.handleUpload.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        console.log("Uploader component mounted");
        console.log("this.props :>> ", this.props);
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.files[0],
        });
    }
    handleUpload(e) {
        e.preventDefault();

        if (!this.state.file) {
            this.setState({ error: true });
        }

        console.log("this.state :>> ", this.state);
        const fd = new FormData();
        fd.append("file", this.state.file);

        fetch("/upload/profile_pic.json", {
            method: "POST",
            body: fd,
        })
            .then((res) => res.json())
            .then(() => {
                // console.log("uploadData :>> ", uploadData);
                console.log("Upload successful");
                this.props.hideUploader();
            })
            .catch((err) => {
                console.log(`fetch upload data failed with: ${err}`);
                this.setState({ generalError: true });
            });
    }
    render() {
        return (
            <div className="uploader">
                <img
                    src="/close_button2.png"
                    alt="close uploader button"
                    className="close-button"
                    onClick={this.props.hideUploader}
                ></img>
                {this.state.generalError && (
                    <h3 id="error">Something went wrong. Please try again!</h3>
                )}
                <form className="upload-form" onSubmit={this.handleUpload}>
                    <div>
                        <input
                            type="file"
                            name="file"
                            id="file"
                            accept="image/*"
                            required
                            onChange={this.handleChange}
                        />
                        <label
                            htmlFor="file"
                            id="file-label"
                            style={{
                                backgroundColor: this.state.error && "#ffafcc",
                            }}
                        >
                            Your best pic
                        </label>
                    </div>
                    <button>Upload</button>
                </form>
            </div>
        );
    }
}
