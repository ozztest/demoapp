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
                        label="Meetings"
                        name="meeting"
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
                            onClick={this.__saveDepartment}>{this.state.buttonName} Department</Button>

                </Col>
                {this.__renderTable()}

            </Panel>
        );
    }
    __saveDepartment =(e) => {
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
                this.__getMeetingData()
                this.setState({
                    name: "",
                    description: "",
                    meeting: "",
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
        let datas = this.state.departmentData;
        console.log(this.state.departmentData)
        for(let i = 0; i< datas.length; i++){
            let data = datas[i];
            arr.push(
                <tr key={i}>
                    <td>{data.id}</td>
                    <td>{data.name}</td>

                    <td>{data.description}</td>

                    <td>{data.meeting}</td>
                    <td><Button style={{margin: 5}}
                                onClick={this.__fillAreasWithSelectedDepartment.bind(undefined, data)}>
                        Update
                    </Button></td>
                    <td><Button style={{margin: 5}}
                                onClick={this.__onDelete.bind(undefined, data)}>
                        Delete
                    </Button></td>
                </tr>);
        }
        return arr;
    };

    __getMeetingData = () => {
        jajax.ajax({
            url: "http://localhost:8080/department/findAll",
            method: "GET",
            dataType: "application/json",
            crossDomain: true
        }).always(function(xhr) {
            if(xhr.status === 200){
                this.setState({
                    departmentData: JSON.parse(xhr.responseText)
                });

            }
        }.bind(this));

    };

    __fillAreasWithSelectedDepartment= (data) =>{
        this.setState({
            name: data.name,
            description:data.description,
            meetingData:data.meetingData,
            buttonName:"Update ",
            update:true
        });
    };


    __onDelete = (data) => {
        jajax.ajax({
            url: "http://localhost:8080/department/delete",
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
                this.__getMeetingData()
            }
        }.bind(this));
    };

    componentDidMount () {

        this.__getMeetingData();

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
