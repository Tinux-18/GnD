import { Component } from "react";
export default class ProfilePic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            generalError: false,
            url: "/default_profile_pic.png",
            refresh: this.props.refreshPic,
        };
    }
    componentDidMount() {
        console.log("Profile Pic component mounted");
        console.log("this.props :>> ", this.props);
        this.fetchPic();
    }
    fetchPic() {
        fetch(`/user/profile_pic.json`)
            .then((res) => res.json())
            .then(({ url }) => {
                console.log("profile pic url :>> ", url);
                this.setState({ url: url });
            })
            .catch((err) => {
                console.log(`fetch user profile pic failed with: ${err}`);
                this.setState({ generalError: true });
            });
    }
    refresh() {
        if (this.state.refresh) {
            console.log("I should refresh");
        }
    }
    render() {
        return (
            <div id={"profile-pic"} onClick={this.props.showUploader}>
                <img
                    alt={`${this.props.first} ${this.props.last}`}
                    src={this.state.url}
                    className="profile-pic"
                />
            </div>
        );
    }
}
