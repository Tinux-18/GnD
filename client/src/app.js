import { Component } from "react";
import { Link } from "react-router-dom";
import ProfilePic from "./profile_pic";
import Logo from "./logo";
import Uploader from "./uploader";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first: "",
            second: "",
            uploaderVisible: false,
            refreshPic: false,
        };
        this.toggleUploader = this.toggleUploader.bind(this);
    }
    componentDidMount() {
        console.log("App component mounted");
        console.log("this.state :>> ", this.state);
        fetch(`/user/profile.json`)
            .then((res) => res.json())
            .then((profileData) => {
                this.setState({
                    first: profileData.first,
                    last: profileData.last,
                });
            })
            .catch((err) =>
                console.log(`fetch user status failed with: ${err}`)
            );
    }
    toggleUploader() {
        this.setState(
            { uploaderVisible: !this.state.uploaderVisible, refreshPic: true },
            () => {
                console.log("this :>> ", this);
            }
        );
    }

    render() {
        return (
            <>
                <nav>
                    <Logo />
                    <ProfilePic
                        first={this.state.first}
                        last={this.state.last}
                        showUploader={this.toggleUploader}
                        refreshPic={this.state.refreshPic}
                    />
                </nav>

                {this.state.uploaderVisible && (
                    <Uploader
                        hideUploader={this.toggleUploader}
                        updateProfilePic={this.updateProfilePic}
                    />
                )}
            </>
        );
    }
}
