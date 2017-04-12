import React from 'react';
import TextInput from "robe-react-ui/lib/inputs/TextInput";
import Panel from "react-bootstrap/lib/Panel";
import Col from "react-bootstrap/lib/Col";
import SelectInput from "robe-react-ui/lib/inputs/SelectInput";
import jajax from "robe-ajax";
import Toast from "robe-react-ui/lib/toast/Toast";
import Table from "react-bootstrap/lib/Table";
import Button from "react-bootstrap/lib/Button";
import Modal from 'react-awesome-modal';

export default class Meeting extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            meetingData : [],
            departmentData : [],
            name: "",
            description: "",
            update: true,
            buttonName: "Add New "
        };
    }

    render() {
        return (
            <Panel header={"Meeting"} bsStyle="success">

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
                        label="Departments"
                        name="department"
                        multi={true}
                        items={this.state.departmentData}
                        value={this.state.department}
                        textField="value"
                        valueField="key"
                        onChange={this.__handleChange}
                        validations={{
                        required: true
                    }}
                        />


                    <Button className="pull-right" bsStyle="success" style={{marginBottom: 15}}
                            onClick={this.__saveMeeting}>{this.state.buttonName} Meeting</Button>

                </Col>
                {this.__renderTable()}

            </Panel>
        );
    }
    __saveMeeting =(e) => {
        let data = {
            name: this.state.name,
            description: this.state.description,
            department: {
                id: this.state.department
            }
        };
        let url = "http://localhost:8080/meeting/save/" + this.state.department;
        let method="POST";

        if(this.state.update){
            url ="http://localhost:8080/meeting/update/";
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
                Toast.success("Meeting saved successfully...");
                this.__getDepartmentData()
                this.setState({
                    name: "",
                    description: "",
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
                <th>Meeting Id</th>
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
        let datas = this.state.meetingData;

        for(let i = 0; i< datas.length; i++){
            let data = datas[i];
            arr.push(
                <tr key={i}>
                    <td>{data.id}</td>
                    <td>{data.name}</td>
                    <td>{data.description}</td>
                    <td>{data.meeting}</td>
                    <td><Button onClick={this.__fillAreasWithSelectedMeeting.bind(undefined, data)}>Update</Button>
                        <Button onClick={this.__onDelete.bind(undefined, data)}>Delete</Button></td>
                </tr>);
        }
        return arr;
    };

    __getMeetingData = () => {
        jajax.ajax({
            url: "http://localhost:8080/meeting/findAll",
            method: "GET",
            dataType: "application/json",
            crossDomain: true
        }).always(function(xhr) {
            if(xhr.status === 200){
                this.setState({employeeData: JSON.parse(xhr.responseText)});
            }
        }.bind(this));
    };

    __fillAreasWithSelectedMeeting= (data) =>{
        this.setState({
            name: data.name,
            description:data.description,
            department:data.department.id,
            buttonName:"Update ",
            update:true
        });

    };


    __onDelete = (data) => {
        jajax.ajax({
            url: "http://localhost:8080/meeting/delete",
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
                this.__getDepartmentData()
            }
        }.bind(this));
    };

    componentDidMount () {

        this.__getMeetingData();

        jajax.ajax({
            url: "http://localhost:8080/meeting/findAll",
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
