import React from 'react';
import uuid from 'react-uuid';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.css';
import addMessageToRoomCustom from './customMutations';
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import * as mutations from './graphql/mutations';
// import * as subscriptions from './graphql/subscriptions';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			roomName: '',
			joinRoomName: '',
			activeRoomName: '',
			currentMessage: ''
		};
	}
	
	createRoomHandler = () => {
		let data = {
			id: this.state.roomName,
			messages: ["Room: Welcome to the room !!"]
		};
		console.log(data)
		API.graphql(graphqlOperation(mutations.createRoom, {input: data})).then((data) => {
			console.log(data);
			alert("Room Created");
		}).catch((e) => {
			console.log("error", e);
		});
	};

	sendMessage = () => {
		let data = {
			roomId: this.state.activeRoomName,
			message: this.state.currentMessage
		}
		let addMessageToRoomCustomMutation = addMessageToRoomCustom(this.state.activeRoomName, this.state.currentMessage);
		console.log(addMessageToRoomCustomMutation);
		API.graphql(graphqlOperation(addMessageToRoomCustomMutation, {input: data})).then((data) => {
			console.log(data);
		})
	};

	roomNameChangeHandler = event => {
		this.setState({roomName: event.target.value}, () => {
			console.log("From Room Name Change Handler Function", this.state)
		});
	};
	
	joinRoomNameChangeHandler = event => {
		this.setState({joinRoomName: event.target.value}, () => {
			console.log("From Join Room Name Change Handler Function", this.state)
		});
	};
	
	joinRoomHandler = event => {
		this.setState({activeRoomName: this.state.joinRoomName}, () => {
			console.log("From Join Room Handler Function", this.state)
		});
	};

	generateRandomName = () => {
		let randomName = uuid();
		this.setState({
			roomName: randomName
		}, () => {
			console.log("From Generate Random Name Function", this.state);
		});
	};
	
	currentMessageChanged = event => {
		this.setState({currentMessage: event.target.value});
	};

	render() {
		return (
			<React.Fragment>
				<div className="container container-wrapper">
					<h2>React - AppSync Chatroom</h2>
					<div className="input-group input-group-sm mb-3">
						<div className="input-group-prepend">
							<span className="input-group-text small-bold" id="inputGroup-sizing-sm">Room Name</span>
						</div>
						<input type="text" className="form-control" aria-label="Room Name" aria-describedby="inputGroup-sizing-sm" value = {this.state.roomName}
						onChange = {this.roomNameChangeHandler}/>
					</div>
					<button onClick = {this.generateRandomName} className="btn btn-primary btn-sm small-bold right-10">Generate Random Room Name</button>	
					<button onClick={this.createRoomHandler} className="btn btn-success btn-sm small-bold">Create New Room</button>
				</div>
				<div className="container container-wrapper"><hr/></div>
				<div className="container container-wrapper">
					<div className="input-group input-group-sm mb-3">
						<div className="input-group-prepend">
							<span className="input-group-text small-bold" id="inputGroup-sizing-sm">Join Room</span>
						</div>
						<input type="text" className="form-control" aria-label="Join Room Name" aria-describedby="inputGroup-sizing-sm" value = {this.state.joinRoomName}
						onChange={this.joinRoomNameChangeHandler} />
					</div>
					<button onClick={this.joinRoomHandler} className="btn btn-success btn-sm small-bold">Join Room</button>
					<div className="messages-wrapper">
						<div className="messages-list-box">
						
						</div>
						<div className="input-group input-group-sm message-input-box">
							<input type="text" placeholder = "Type Message" className="form-control" aria-label="Message" aria-describedby="inputGroup-sizing-sm"
							value = {this.state.currentMessage} onChange={this.currentMessageChanged}/>
							<div className="input-group-append">
								<button className="btn btn-success btn-sm small-bold" onClick={this.sendMessage}><i className="far fa-paper-plane"></i></button>
							</div>
						</div>
					</div>
				</div>
			</React.Fragment>
		)
	}
}


export default App;
