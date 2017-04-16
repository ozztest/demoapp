import React from 'react';

import Col from "react-bootstrap/lib/Col";
import Tabs from "react-bootstrap/lib/Tabs.js";
import Tab from "react-bootstrap/lib/Tab";
import Navbar from "react-bootstrap/lib/Navbar.js";
import Nav from "react-bootstrap/lib/Nav.js";
import NavItem from "react-bootstrap/lib/NavItem";
import Employee from "./pages/Employee.js";
import Department from "./pages/Department.js";
import Meeting from "./pages/Meeting.js";
import jajax from "robe-ajax";

export default class App extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            employeeData : [],
            departmentData : [],
            meeting:"test"
        };
    }

    render () {
        return (
            <Col>
                <Navbar>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="#">React-Bootstrap-SpringBoot Example</a>
                        </Navbar.Brand>
                    </Navbar.Header>
                    <Nav>
                        <NavItem eventKey={1} href="#">buraya da github linki koyduk mu tamamdýr</NavItem>
                    </Nav>
                </Navbar>
            <Col style={{paddingLeft: 100,paddingRight: 100}}>

                <Tabs defaultActiveKey={2} id="uncontrolled-tab-example">
                <Tab eventKey={1} title="Employee">
                    <Employee />
                </Tab>
                <Tab eventKey={2} title="Department">
                    <Department departmentData={this.state.departmentData} />
                </Tab>
                <Tab eventKey={3} title="Meeting">
                    <Meeting/>
                </Tab>
            </Tabs>
            </Col>
                </Col>);
    };


    componentDidMount(){
        console.log("bir")
        this.__getDepartmentDat();
        console.log(this.state.departmentData)
    }

    __getDepartmentDat () {
        console.log("iki")
        jajax.ajax({
            url: "http://localhost:8080/department/findAll",
            method: "GET",
            dataType: "application/json",
            crossDomain: true
        }).always(function (xhr) {
            if (xhr.status === 200) {
                this.setState({departmentData: JSON.parse(xhr.responseText)});
            }
        }.bind(this));

    };

};


