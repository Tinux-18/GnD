import { Component } from "react";
export default class Bio extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        console.log("Profile Pic mounted");
    }
    render() {
        return <div className="bio"></div>;
    }
}
