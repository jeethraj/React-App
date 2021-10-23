import React from 'react';
import '../Styles/header.css';
import Modal from 'react-modal';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import axios from 'axios';
import SuccessAlert from './success';
import FailureAlert from './failure';
import queryString from 'query-string';
import {Redirect } from 'react-router-dom';


const customStyles = {
    content: {
        top: '55%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'antiquewhite',
        border: 'solid 1px brown',
        zIndex:3
    },
};

class Header extends React.Component {
    constructor() {
        super();
        this.state = {
            loginModalIsOpen: false,
            SignInModalIsOpen:false,
            isLoggedIn: false,
            loggedInUser: undefined,
            name:undefined,
            pwd:undefined,
            user:[],
            CreatUserModelIsOpen:false,
            sname:undefined,
            slname:undefined,
            spwd:undefined,
            suname:undefined,
            alert_message:'',
            status: false

        }
    }

    handleHomeNavigate = () => {
       sessionStorage.clear();
       // this.props.history.replace(`http://localhost:3000/`);
      
    }

    handleLogin = () => {
        this.setState({ loginModalIsOpen: true });
    }

    responseGoogle = (response) => {
        this.setState({ isLoggedIn: true, loggedInUser: response.profileObj.name, loginModalIsOpen: false })
    }

    responseFacebook = (response) => {
        this.setState({ isLoggedIn: true, loggedInUser: response.name, loginModalIsOpen: false })
    }

    handleLogout = () => {
        this.setState({ isLoggedIn: false, loggedInUser: undefined });
    }
    handleModalState = (state, value) => {
        this.setState({ [state]: value });
        //this.setState({ subTotal: 0 });
    }

    handleInputChange = (event,state) => {
        this.setState({ [state] : event.target.value});
}

handleSignIn = () =>{
   const {name, pwd} =this.state;
   const loginObj = {
    username:name,
    password:pwd
   };
    axios({
        url: 'http://localhost:8722/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: loginObj
    })
        .then(response => {
            this.setState({ user:response.data.user,isLoggedIn: true, loggedInUser: name, loginModalIsOpen: false ,SignInModalIsOpen:false})
        })
        .catch()
}

handleCreatUser = () =>{
    this.setState({ CreatUserModelIsOpen: true });
}
handleUserCration =() =>{

    const {sname, slname,spwd,suname} =this.state;
   const loginObj = {
    username:suname,
    password:spwd,
    firstname:sname,
    lastname:slname
   };
    axios({
        url: 'http://localhost:8722/signup',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: loginObj
    })
        .then(response => {
            this.setState({ user:response.data.user , alert_message:'success'})
        })
        .catch(err => {
            this.setState({ alert_message:'failure'})
        })

}
    render() {
        const { loginModalIsOpen, isLoggedIn  , loggedInUser,SignInModalIsOpen,user ,CreatUserModelIsOpen} = this.state;
        return (
            <div>
                <div className="app-header">
                    <div className="header-logo"   >
                        <b><a style={{ textDecoration: 'none',color: 'red' }} href='http://localhost:3000/'>e!</a></b>
                    </div>
                    {isLoggedIn ? <div className="user-button-gp">
                        <div className="user-login">{loggedInUser}</div>
                        <div className="user-signup" onClick={this.handleLogout}>Logout</div>
                    </div> :
                        <div className="user-button-gp">
                            <div className="user-login" onClick={this.handleLogin}>Login</div>
                            <div className="user-signup" onClick={this.handleCreatUser}>Create an account</div>
                        </div>
                    }
                </div>
                <Modal
                    isOpen={loginModalIsOpen}
                    style={customStyles}
                >
                     <div className="glyphicon glyphicon-remove" style={{ float: 'right', margin: '5px' }} onClick={() => this.handleModalState('loginModalIsOpen', false)}></div>
                    <div>
                        <GoogleLogin
                            clientId="287342980794-q8modqmsoqlvkhrgcbh3bhbom5i1voqn.apps.googleusercontent.com"
                            buttonText="Continue with Google"
                            onSuccess={this.responseGoogle}
                            onFailure={this.responseGoogle}
                            cookiePolicy={'single_host_origin'}
                        />
                        <br/><br/>
                        <FacebookLogin
                            appId="238892544864485"
                            //autoLoad={true}
                            fields="name,email,picture"


                            callback={this.responseFacebook} />

                        <div className="jp-signin">Already have account
                           <button className="btn btn-danger jp-signinb" onClick={() => this.handleModalState('SignInModalIsOpen', true)} >Sign in</button>
                        </div>
                    </div>
                </Modal>
                <Modal
                    isOpen={SignInModalIsOpen}
                    style={customStyles}
                    >
                    <div>
                    <div className="glyphicon glyphicon-remove" style={{ float: 'right', margin: '5px' }} onClick={() => this.handleModalState('SignInModalIsOpen', false)}></div>
                            <div class="form-group">
                                <label for="usr" >Username:</label>
                                <input type="text" placeholder="Enter Username" class="form-control" id="usr" style={{"width":"450px"}} onChange={ (event)=>this.handleInputChange(event,'name')}/>
                            </div>
                            <div class="form-group">
                                <label for="usr" >Password</label>
                                <input type="password" placeholder="Enter Password" class="form-control" id="usr" style={{"width":"450px"}} onChange={ (event)=>this.handleInputChange(event,'pwd')}/>
                            </div>
                            <button className="btn btn-danger jp-signinb" onClick={() => this.handleSignIn()} >Proceed</button>
                        </div>
                
                </Modal>
                <Modal
                    isOpen={CreatUserModelIsOpen}
                    style={customStyles}
                    >
                    <div>   
                    <div className="glyphicon glyphicon-remove" style={{ float: 'right', margin: '5px' }} onClick={() => this.handleModalState('CreatUserModelIsOpen', false)}></div>
                    {this.state.alert_message=='success'?<SuccessAlert/>:null}
                    {this.state.alert_message=='failure'?<FailureAlert/>:null}
                    <div class="form-group">
                                <label for="usr" >First Name</label>
                                <input type="text" placeholder="Enter First Name" class="form-control" id="usr" style={{"width":"450px"}} onChange={ (event)=>this.handleInputChange(event,'sname')}/>
                            </div>
                            <div class="form-group">
                                <label for="usr" >Last Name</label>
                                <input type="text" placeholder="Enter Last Name" class="form-control" id="usr" style={{"width":"450px"}} onChange={ (event)=>this.handleInputChange(event,'slname')}/>
                            </div>
                            <div class="form-group">
                                <label for="usr" >Username:</label>
                                <input type="text" placeholder="Enter Username" class="form-control" id="usr" style={{"width":"450px"}} onChange={ (event)=>this.handleInputChange(event,'suname')}/>
                            </div>
                            <div class="form-group">
                                <label for="usr" >Password</label>
                                <input type="password" placeholder="Enter Password" class="form-control" id="usr" style={{"width":"450px"}} onChange={ (event)=>this.handleInputChange(event,'spwd')}/>
                            </div>
                            <button className="btn btn-danger jp-signinb" onClick={() => this.handleUserCration()} >Creat User</button>
                        </div>
                
                </Modal>
            </div>
        )
    }
}

export default Header;