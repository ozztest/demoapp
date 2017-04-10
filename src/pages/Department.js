import React from 'react';
import Select from 'react-select';
import Navbar from "react-bootstrap/lib/Navbar.js";
import TextInput from "robe-react-ui/lib/inputs/TextInput";
import Panel from "react-bootstrap/lib/Panel";
import Col from "react-bootstrap/lib/Col";
import NumericInput from "robe-react-ui/lib/inputs/TextInput";
import SelectInput from "robe-react-ui/lib/inputs/SelectInput";
import jajax from "robe-ajax";
import Toast from "robe-react-ui/lib/toast/Toast";
import Table from "react-bootstrap/lib/Table";
import Button from "react-bootstrap/lib/Button";

import ModalDataForm from "robe-react-ui/lib/form/ModalDataForm";

export default class Department extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            departmentData : [],
            meetingData : [],
            name: "",
            description: "",
            update: true,
            buttonName: "Add New "
        };
    }

    render() {
        return (
            <Panel header={"Department"} bsStyle="success">

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
                        label="Description"
                        name="description"
                        validationDisplay="overlay"
                        value={this.state.description}
                        onChange={this.__handleChange}
                        validations={{
                        required: true,

                    }}/>

                    <SelectInput
                        label="Select Input Multi"
                        name="MultiSelect"
                        multi={true}
                        items={this.state.meetingData}
                        value={this.state.meeting}
                        textField="value"
                        valueField="key"
                        onChange={this.__handleChange}
                        validations={{
                        required: true
                    }}
                        />


                    <Button className="pull-right" bsStyle="success" style={{marginBottom: 15}}
                            onClick={this.__saveEmployee}>{this.state.buttonName} Department</Button>

                </Col>
                {this.__renderTable()}

            </Panel>
        );
    }
    __saveEmployee =(e) => {
        let data = {
            name: this.state.name,
            description: this.state.description,
            meeting: {
                id: this.state.meeting
            }
        };
        let url = "http://localhost:8080/department/save/" + this.state.meeting;
        let method="POST";

        if(this.state.update){
            url ="http://localhost:8080/department/update/";
            method = "PUT";
        }
        jajax.ajax({
            url: url,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            method: method,
            data: JSON.stringify(data),
            dataType: "application/json",
            crossDomain: true
        }).always(function(xhr) {
            if(xhr.status === 200){
                Toast.success("Department saved successfully...");
                this.__getEmployeeData()
                this.setState({
                    name: "",
                    surname: "",
                    salary: undefined,
                    department: "",
                    buttonName: "Add New ",
                    update:false
                });
            }
        }.bind(this));

    }

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
                <th>Department Id</th>
                <th>Name</th>
                <th>Description</th>
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
                    <td>{data.description}</td>
                    <td>{data.meeting.name}</td>
                    <td><Button onClick={this.__fillAreasWithSelectedEmployee.bind(undefined, data)}>Update</Button></td>
                    <td><Button onClick={this.__onDelete.bind(undefined, data)}>Delete</Button></td>
                </tr>);
        }
        return arr;
    };

    __getEmployeeData = () => {
        jajax.ajax({
            url: "http://localhost:8080/department/findAll",
            method: "GET",
            dataType: "application/json",
            crossDomain: true
        }).always(function(xhr) {
            if(xhr.status === 200){
                this.setState({employeeData: JSON.parse(xhr.responseText)});
            }
        }.bind(this));
    };

    __fillAreasWithSelectedEmployee= (data) =>{
        this.setState({name: data.name,
            surname:data.surname,
            salary:data.salary,
            department:data.department.id,
            buttonName:"Update ",
            update:true
        });


        console.log(data.department.id)
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
                this.setState({meetingData: JSON.parse(xhr.responseText)});
            }
        }.bind(this));
    };

}
