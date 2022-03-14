import { Component } from "react";
export default class MyProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            generalError: false,
        };
    }
    componentDidMount() {
        console.log("My profile mounted");
        console.log("this.props :>> ", this.props);
    }
    render() {
        return (
            <div id={"profile-pic"} onClick={this.props.showUploader}>
                <img
                    alt={`${this.props.first} ${this.props.last}`}
                    src={this.props.image || this.state.defaultUrl}
                    className="profile-pic"
                />
            </div>
        );
    }
}
