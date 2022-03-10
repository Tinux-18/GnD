import { Component } from "react";

export default class Logo extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        console.log("Logo mounteded");
    }
    render() {
        return (
            <>
                <img
                    src="/logo.jpeg"
                    alt="Social Leaders Platform logo"
                    id="logo"
                ></img>
            </>
        );
    }
}
