import React from 'react';
import TextInput from "robe-react-ui/lib/inputs/TextInput";
import Panel from "react-bootstrap/lib/Panel";
import Col from "react-bootstrap/lib/Col";
import NumericInput from "robe-react-ui/lib/inputs/NumericInput";
import SelectInput from "robe-react-ui/lib/inputs/SelectInput";
import jajax from "robe-ajax";
import Toast from "robe-react-ui/lib/toast/Toast";
import Table from "react-bootstrap/lib/Table";
import Button from "react-bootstrap/lib/Button";
import Modal from 'react-awesome-modal';

export default class Employee extends React.Component{
    constructor(props) {
        super(props);
            this.state = {
                employeeData : [],
                departmentData : [],
                id: undefined,
                name: "",
                surname: "",
                salary: undefined,
                update: true,
                buttonName: "Add New ",
                visible:false
            };
    }

    render() {
        return (

            <Panel header={"Employee"} bsStyle="success">

                <Modal
                    visible={this.state.visible}
                    width="500"
                    height="350"
                    effect="fadeInUp"
                    onClickAway={() => this.closeModal()}
                    >

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

                    <Button className="pull-right" bsStyle="success" style={{marginBottom: 15}}
                            onClick={this.__saveEmployee}>{this.state.buttonName} Employee</Button>
                </Col>
                </Modal>
                {this.__renderTable()}

                <Button className="pull-right" bsStyle="success" style={{marginBottom: 15}}
                        onClick={() => this.openModal()} > Add New Employee</Button>
            </Panel>
        );
    }

    openModal=() => {
        this.setState({
            visible : true
        });
    }

    closeModal =() => {
        this.__clearForm();
        this.setState({

            visible : false
        });
    }


    __saveEmployee =(e) => {
        let data = {
            id: this.state.id,
            name: this.state.name,
            surname: this.state.surname,
            salary: this.state.salary,
            department: {
                id: this.state.department
            }
        };
        let url = "http://localhost:8080/employee/save/" + this.state.department;
        let method="POST";

        if(this.state.update){
            console.log(this.state.update);
            url ="http://localhost:8080/employee/update/";
            method = "PUT";
            console.log(method)
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
                Toast.success("Employee saved successfully...");
                this.__getEmployeeData();
               this.__clearForm()
            }
        }.bind(this));

        this.closeModal();

    };
    __clearForm () {
        this.setState({
            id:undefined,
            name: "",
            surname: "",
            salary: undefined,
            department: "",
            buttonName: "Add New ",
            update:false
        });
};
    __handleChange = (e) => {
        let state = {};
        let value = e.target.parsedValue !== undefined ? e.target.parsedValue : e.target.value;
        state[e.target.name] = value;
        this.setState(state);
    };

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
                    <td>
                        <Button style={{margin: 5}}
                                onClick={this.__fillAreasWithSelectedEmployee.bind(undefined, data)}>
                            Update
                        </Button>
                        <Button style={{margin: 5}}
                                onClick={this.__onDelete.bind(undefined, data)}>
                            Delete
                        </Button>
                    </td>
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

    __fillAreasWithSelectedEmployee= (data) =>{
        this.openModal();

        this.setState({
            id:data.id,
            name: data.name,
            surname:data.surname,
            salary:data.salary,
            department:data.department.id,
            buttonName:"Update ",
            update:true
        });
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
                this.__getEmployeeData();
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

}
