import { Component } from "react";
import Bio from "./bio";

export default class MyProfile extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        console.log("My profile mounted");
    }
    render() {
        return (
            <div className="my-profile">
                {this.props.profilePic}
                <div className="profile">
                    <h1>
                        {this.props.first} {this.props.last}
                    </h1>
                    <Bio
                        bio={this.props.bio}
                        updateBio={(bio) => {
                            this.props.updateBio(bio);
                        }}
                    />
                </div>
            </div>
        );
    }
}
