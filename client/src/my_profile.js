import { Component } from "react";
import Bio from "./bio";

export default class MyProfile extends Component {
    constructor(props) {
        super(props);
        this.updateBio = this.updateBio.bind(this);
    }
    componentDidMount() {
        console.log("My profile mounted");
        console.log("this.props :>> ", this.props);
    }
    updateBio(url) {
        this.setState({ image: url }, () => {
            console.log("this :>> ", this);
        });
    }
    render() {
        return (
            <div className="my-profile">
                {this.props.profilePic}
                <div className="profile">
                    <h1>
                        {this.props.first} {this.props.last}
                    </h1>
                </div>
                <Bio bio={this.props.bio} updateBio={this.updateBio} />
            </div>
        );
    }
}
