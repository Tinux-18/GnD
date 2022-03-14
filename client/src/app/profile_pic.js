import { Component } from "react";
export default class ProfilePic extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        console.log("Profile Pic mounted");
    }
    render() {
        return (
            <div id={"profile-pic"} onClick={this.props.showUploader}>
                <img
                    alt={`${this.props.first} ${this.props.last}`}
                    src={this.props.image || "/default_profile_pic.png"}
                    className="profile-pic"
                />
            </div>
        );
    }
}
