import React from 'react';
import uuid from 'react-uuid';
import queryString from 'query-string';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.css';
import addMessageToRoomCustom from './customMutations';
import getMessagesQuery from './customQueries';
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import * as mutations from './graphql/mutations';
import * as subscriptions from './graphql/subscriptions';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			roomName: '',
			joinRoomName: '',
			activeRoomName: '',
			currentMessage: '',
			messages: [],
			userName: ''
		};
	}

	componentDidMount() {
		if (queryString.parse(window.location.search)["_joinroomid"] === null || queryString.parse(window.location.search)["_joinroomid"] === '' || queryString.parse(window.location.search)["_joinroomid"] === undefined)
		{} else {
			this.setState({joinRoomName: queryString.parse(window.location.search)["_joinroomid"]}, () => {
				this.joinRoomHandler();
			});
		}
	}
	
	createRoomHandler = () => {
		if (this.state.roomName === '' || this.state.roomName === null){
			alert('Room Name cannot be empty !!')
		} else {
			let data = {
				id: this.state.roomName,
				messages: ["Room: Welcome to the room !!"]
			};
			API.graphql(graphqlOperation(mutations.createRoom, {input: data})).then((data) => {
				alert("Room Created");
			}).catch((e) => {
				alert("Error !!");
			});
		}
	};

	sendMessage = () => {
		if (this.state.userName === '' || this.state.userName === null){
			alert("Enter some username");
		} else {
			let data = {
				roomId: this.state.activeRoomName,
				message: this.state.userName + ": " + this.state.currentMessage
			}
			let addMessageToRoomCustomMutation = addMessageToRoomCustom(this.state.activeRoomName, this.state.userName + ": " + this.state.currentMessage);
			API.graphql(graphqlOperation(addMessageToRoomCustomMutation, {input: data})).then((data) => {
				this.setState({currentMessage: ''});
			})
		}
	};

	roomNameChangeHandler = event => {
		this.setState({roomName: event.target.value}, () => {
		});
	};
	
	joinRoomNameChangeHandler = event => {
		this.setState({joinRoomName: event.target.value}, () => {
		});
	};
	
	joinRoomHandler = event => {
		this.setState({activeRoomName: this.state.joinRoomName}, () => {
			let getMessagesQueryString = getMessagesQuery(this.state.activeRoomName);
			API.graphql(graphqlOperation(getMessagesQueryString, {input: {id: this.state.activeRoomName}})).then((data) => {
				this.setState({messages: data.data.getRoom.messages}, () => {
					let mBox = document.getElementById("messagesListBox");
					mBox.scrollTo(0, mBox.scrollHeight);
				});
				// eslint-disable-next-line
				const subscription = API.graphql(graphqlOperation(subscriptions.messageAddedToRoom)).subscribe((data) => {
					this.setState({messages: data.value.data.messageAddedToRoom.messages},() => {
						let mBox = document.getElementById("messagesListBox");
						mBox.scrollTo(0, mBox.scrollHeight);
					});
				});
			}).catch((e) => {
				alert("Error occured when fetching messages");
			});
		});
	};

	generateRandomName = () => {
		let randomName = uuid();
		this.setState({
			roomName: randomName
		}, () => {
		});
	};
	
	userNameChangeHandler = event => {
		this.setState({userName: event.target.value}, () => {
		});
	};
	
	currentMessageChanged = event => {
		this.setState({currentMessage: event.target.value});
	};

	seperateMessage = message => {
		let m = message.split(":");
		m.shift();
		let a = m.join(":");
		return a;
	};

	copyRoomHandler = () => {
		let copyUrl = window.location.origin + "/?_joinroomid=" + encodeURIComponent(this.state.activeRoomName);
		prompt("Please copy below URL",copyUrl);
		// navigator.permissions.query({name: "clipboard-write"}).then((result) => {
		// 	if (result.state === "granted" || result.state === "prompt") {
		// 		console.log("Copy permissions granted");
		// 		navigator.clipboard.writeText(copyUrl).then(() => {
		// 			alert("Room URL Copied");
		// 		},(err) => {
		// 			alert("Error occured while copying");
		// 		});		
		// 	}
		// });
	};


	render() {
		return (
			<React.Fragment>
				<div className="container container-wrapper">
					<h5>React - AppSync Chatroom</h5>
				</div>
				<div className="container container-wrapper">
					<div className="input-group input-group-sm mb-3">
						<div className="input-group-prepend">
							<span className="input-group-text small-bold" id="inputGroup-sizing-sm">Room Name</span>
						</div>
						<input type="text" placeholder = "Enter new room name" className="form-control" aria-label="Room Name" aria-describedby="inputGroup-sizing-sm" value = {this.state.roomName}
						onChange = {this.roomNameChangeHandler}/>
					</div>
					<button onClick = {this.generateRandomName} className="btn btn-primary btn-sm small-bold right-10">Generate Randomly</button>	
					<button onClick={this.createRoomHandler} className="btn btn-success btn-sm small-bold">Create</button>
				</div>
				<div className="container container-wrapper"><hr/></div>
				<div className="container container-wrapper">
					<div className="input-group input-group-sm mb-3">
						<input type="text" placeholder = "Enter room name to join" className="form-control" aria-label="Join Room Name" aria-describedby="inputGroup-sizing-sm" value = {this.state.joinRoomName}
						onChange={this.joinRoomNameChangeHandler} />
						<div className="input-group-append">
							<button onClick={this.joinRoomHandler} className="btn btn-success btn-sm small-bold">Join Room</button>
							<button onClick={this.copyRoomHandler} className="btn btn-outline-secondary btn-sm small-bold">Copy URL</button>
						</div>
					</div>
					<hr></hr>
					<div className="input-group input-group-sm mb-3">
						<div className="input-group-prepend">
							<span className="input-group-text small-bold" id="inputGroup-sizing-sm">Username</span>
						</div>
						<input type="text" placeholder = "Enter your name" className="form-control" aria-label="Username" aria-describedby="inputGroup-sizing-sm" value = {this.state.userName}
						onChange={this.userNameChangeHandler} />
					</div>
					<div className="messages-wrapper">
						<div className="messages-list-box mb-3" id="messagesListBox">
							{
								this.state.messages.map(message => (
									<div className="list-group list-group-flush" key={uuid()}>
										<div className="list-group-item list-group-item-action">
											<div className="d-flex w-100 justify-content-between">
												<p className="mb-1 small-bold">[{message.split(":")[0]}]</p>
											</div>
											<small className="message-small">{this.seperateMessage(message)}</small>
										</div>
										<hr className="no-margin"></hr>
									</div>
								))
							}
						</div>
						<div className="input-group input-group-sm message-input-box mb-3">
							<textarea type="text" placeholder = "Type Message" className="form-control" aria-label="Message" aria-describedby="inputGroup-sizing-sm"
							value = {this.state.currentMessage} onChange={this.currentMessageChanged}></textarea>
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
