import React, {Component,PropTypes} from 'react';

import Col from "react-bootstrap/lib/Col";
import Table from "react-bootstrap/lib/Table";
import Tabs from "react-bootstrap/lib/Tabs.js";
import Tab from "react-bootstrap/lib/Tab";
import TextInput from "robe-react-ui/lib/inputs/TextInput";
import NumericInput from "robe-react-ui/lib/inputs/TextInput";
import SelectInput from "robe-react-ui/lib/inputs/SelectInput";
import Button from "react-bootstrap/lib/Button";
import Panel from "react-bootstrap/lib/Panel";
import Navbar from "react-bootstrap/lib/Navbar.js";
import Nav from "react-bootstrap/lib/Nav.js";
import NavDropdown from "react-bootstrap/lib/NavDropdown.js";
import NavItem from "react-bootstrap/lib/NavItem";
import Employee from "./pages/Employee.js";
import Department from "./pages/Department.js"

export default class App extends Component {

    constructor(props){
        super(props);

        this.state = {

        };
    }

    render () {
        return (
            <Col>
                <Navbar>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="#">React-Bootstrap</a>
                        </Navbar.Brand>
                    </Navbar.Header>
                    <Nav>
                        <NavItem eventKey={1} href="#">Link</NavItem>
                        <NavItem eventKey={2} href="#">Link</NavItem>
                    </Nav>
                </Navbar>
            <Col style={{padding: 30}}>

                <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
                <Tab eventKey={1} title="Employee">
                    <Employee/>
                </Tab>
                <Tab eventKey={2} title="Department">
                    <Department/>
                </Tab>
                <Tab eventKey={3} title="Tab 3">Tab 3 content</Tab>
            </Tabs>
            </Col>
                </Col>);
    };

};


