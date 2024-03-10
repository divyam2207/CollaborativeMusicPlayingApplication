import React, { Component } from "react";
import { render } from "react-dom";
import HomePage from "./HomePage";
import styles from '../../static/css/index.css'; // Adjust the import path


    export default class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="centerDiv">
            <HomePage />
            </div>
            );
    }
    }

    const appDiv = document.getElementById("app");
    render(<App />, appDiv);

