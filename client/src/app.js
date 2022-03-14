import { Component } from "react";
import { Link } from "react-router-dom";
import ProfilePic from "./profile_pic";
import Logo from "./logo";
import Uploader from "./uploader";
import MyProfile from "./my_profile";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first: "",
            second: "",
            image: "",
            bio: "",
            uploaderVisible: false,
        };
        this.toggleUploader = this.toggleUploader.bind(this);
        this.updateImage = this.updateImage.bind(this);
        this.getData = this.getData.bind(this);
    }
    componentDidMount() {
        console.log("App component mounted");
        try {
            this.getData();
        } catch (err) {
            console.log(
                `fetch user profile or profile pic failed with: ${err}`
            );
        }
    }
    async getData() {
        function getProfile() {
            return fetch(`/user/profile.json`)
                .then((res) => {
                    return res.json();
                })
                .catch((err) =>
                    console.log(`fetch user status failed with: ${err}`)
                );
        }

        function getProfilePic() {
            return fetch(`/user/profile_pic.json`)
                .then((res) => {
                    return res.json();
                })
                .catch((err) => {
                    console.log(`fetch user profile pic failed with: ${err}`);
                });
        }

        const profile = await getProfile();
        const profilePic = await getProfilePic();
        this.setState({
            first: profile.first,
            last: profile.last,
            image: profilePic.url,
        });
    }
    toggleUploader() {
        this.setState(
            { uploaderVisible: !this.state.uploaderVisible, refreshPic: true },
            () => {
                console.log("this :>> ", this);
            }
        );
    }
    updateImage(url) {
        this.setState({ image: url }, () => {
            console.log("this :>> ", this);
        });
    }

    render() {
        return (
            <>
                <nav>
                    <Logo />
                    <ProfilePic
                        first={this.state.first}
                        last={this.state.last}
                        image={this.state.image}
                        showUploader={this.toggleUploader}
                    />
                </nav>
                <MyProfile
                    {...this.state}
                    profilePic={
                        <ProfilePic
                            first={this.state.first}
                            last={this.state.last}
                            image={this.state.image}
                            showUploader={this.toggleUploader}
                        />
                    }
                />

                {this.state.uploaderVisible && (
                    <Uploader
                        hideUploader={this.toggleUploader}
                        updateImage={this.updateImage}
                    />
                )}
            </>
        );
    }
}
