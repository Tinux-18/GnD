import { Component } from "react";
import { Link } from "react-router-dom";
import { BrowserRouter, Route } from "react-router-dom";

import Logo from "../general/logo";
import ProfilePic from "./profile_pic";
import Uploader from "./uploader";
import MyProfile from "./my_profile";
import FindUsers from "./find_users";
import OtherProfile from "./other_profile";

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

        const profile = await getProfile();
        this.setState({
            first: profile.first,
            last: profile.last,
            bio: profile.bio,
            image: profile.url,
        });
    }
    render() {
        return (
            <>
                <nav>
                    <Logo />
                    <div className="nav-right">
                        <a href="/users">Find other leaders</a>
                        <ProfilePic
                            first={this.state.first}
                            last={this.state.last}
                            image={this.state.image}
                            showUploader={() => {
                                this.setState({
                                    uploaderVisible:
                                        !this.state.uploaderVisible,
                                });
                            }}
                        />
                    </div>
                </nav>
                <BrowserRouter>
                    <Route exact path="/">
                        <MyProfile
                            {...this.state}
                            profilePic={
                                <ProfilePic
                                    first={this.state.first}
                                    last={this.state.last}
                                    image={this.state.image}
                                    showUploader={() => {
                                        this.setState({
                                            uploaderVisible:
                                                !this.state.uploaderVisible,
                                        });
                                    }}
                                />
                            }
                            updateBio={(bio) => {
                                this.setState({ bio: bio });
                            }}
                        />
                    </Route>
                    <Route path="/users">
                        <FindUsers />
                    </Route>
                    <Route path="/other-user/:otherUserId">
                        <OtherProfile />
                    </Route>
                </BrowserRouter>

                {this.state.uploaderVisible && (
                    <Uploader
                        hideUploader={() => {
                            this.setState({
                                uploaderVisible: !this.state.uploaderVisible,
                            });
                        }}
                        updateImage={(url) => {
                            this.setState({ image: url });
                            this.getData();
                        }}
                    />
                )}
            </>
        );
    }
}
