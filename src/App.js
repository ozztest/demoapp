import React, {Component} from 'react';
import jajax from "robe-ajax";
import Col from "react-bootstrap/lib/Col";
import Table from "react-bootstrap/lib/Table";
import Tabs from "react-bootstrap/lib/Tabs.js";
import Tab from "react-bootstrap/lib/Tab";
import TextInput from "robe-react-ui/lib/inputs/TextInput"
import NumericInput from "robe-react-ui/lib/inputs/TextInput";
import SelectInput from "robe-react-ui/lib/inputs/SelectInput";
import Button from "react-bootstrap/lib/Button";
import Panel from "react-bootstrap/lib/Panel";
import Navbar from "react-bootstrap/lib/Navbar.js";
import Nav from "react-bootstrap/lib/Nav.js";
import NavDropdown from "react-bootstrap/lib/NavDropdown.js";
import NavItem from "react-bootstrap/lib/NavItem";
import Toast from "robe-react-ui/lib/toast/Toast";

export default class App extends Component {

    constructor(props){
        super(props);

        this.state = {
            employeeData : [],
            departmentData : [],
            name: "",
            surname: "",
            salary: undefined
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
                    <Panel header={"Employee"} bsStyle="success">

                    <Col style={{padding: 10}}>
                    <TextInput
                        label="Name"
                        name="name"
                        validationDisplay="overlay"
                        value={this.state.name}
                        onChange={this.__handleChange}
                        validations={{
                        required: true

                    }}/>

                    <TextInput
                        label="Surname"
                        name="surname"
                        validationDisplay="overlay"
                        value={this.state.surname}
                        onChange={this.__handleChange}
                        validations={{
                        required: true,
                        minLength: {
                            args: [3]
                        }
                    }}/>

                    <NumericInput
                        label="Salary"
                        name="salary"
                        validationDisplay="overlay"
                        value={this.state.salary}
                        onChange={this.__handleChange}
                        validations={{
                        required: true
                    }}
                        />

                        <SelectInput
                            label="Department"
                            name="department"
                            items={this.state.departmentData}
                            textField="name"
                            valueField="id"
                            readOnly={true}
                            value={this.state.department}
                            onChange={this.__handleChange}
                            />

                        <Button className="pull-right" bsStyle="success" style={{marginBottom: 15}} onClick={this.__saveEmployee}>Ekle</Button>
                        </Col>
                    {this.__renderTable()}

                    </Panel>
                </Tab>
                <Tab eventKey={2} title="Department"><Panel header="Department" bsStyle="success">Deneme</Panel></Tab>
                <Tab eventKey={3} title="Tab 3">Tab 3 content</Tab>
            </Tabs>
            </Col>
                </Col>);
    };

    __saveEmployee =(e) => {
        let data = {
            name: this.state.name,
            surname: this.state.surname,
            salary: this.state.salary,
            department: {
                id: this.state.department
            }
        };

        console.log(data)
        jajax.ajax({
            url: "http://localhost:8080/employee/save/" + this.state.department,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            method: "POST",
            data: JSON.stringify(data),
            dataType: "application/json",
            crossDomain: true
        }).always(function(xhr) {
            if(xhr.status === 200){
                Toast.success("Employee saved successfully...");
                this.__getEmployeeData()
                this.setState({
                    name: "",
                    surname: "",
                    salary: undefined,
                    department: ""
                });
            }
        }.bind(this));

    };
    __handleChange = (e) => {
        let state = {};
        let value = e.target.parsedValue !== undefined ? e.target.parsedValue : e.target.value;
        state[e.target.name] = value;
        this.setState(state);
    }

    __renderTable = () => {
       return <Table responsive style={{marginTop: 60}}>
            <thead>
            <tr>
                <th>Employee Id</th>
                <th>Name</th>
                <th>Surname</th>
                <th>Salary</th>
                <th>Department</th>
                <th>Action</th>
            </tr>
            </thead>
            <tbody>
            {this.__renderTableRows()}

            </tbody>
        </Table>;
    };

    __renderTableRows = () => {
        let arr = [];
        let datas = this.state.employeeData;

        for(let i = 0; i< datas.length; i++){
            let data = datas[i];
            arr.push(
                <tr key={i}>
                <td>{data.id}</td>
                <td>{data.name}</td>
                <td>{data.surname}</td>
                <td>{data.salary}</td>
                <td>{data.department.name}</td>
                    <td><Button onClick={this.__onDelete.bind(undefined, data)}>Delete</Button></td>
                </tr>);
        }
        return arr;
    };

    __getEmployeeData = () => {
        jajax.ajax({
            url: "http://localhost:8080/employee/findAll",
            method: "GET",
            dataType: "application/json",
            crossDomain: true
        }).always(function(xhr) {
            if(xhr.status === 200){
                this.setState({employeeData: JSON.parse(xhr.responseText)});
            }
        }.bind(this));
    };

    __onDelete = (data) => {
        jajax.ajax({
            url: "http://localhost:8080/employee/delete",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            method: "DELETE",
            data: JSON.stringify(data),
            dataType: "application/json",
            crossDomain: true
        }).always(function(xhr) {
            if(xhr.status === 200){
                this.__getEmployeeData()
            }
        }.bind(this));
    };

    componentDidMount () {

        this.__getEmployeeData();

        jajax.ajax({
            url: "http://localhost:8080/department/findAll",
            method: "GET",
            dataType: "application/json",
            crossDomain: true
        }).always(function(xhr) {
            if(xhr.status === 200){
                this.setState({departmentData: JSON.parse(xhr.responseText)});
            }
        }.bind(this));
    };
};


