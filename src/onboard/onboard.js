import React from 'react'
import { Redirect } from 'react-router-dom'
import uuid from 'uuid/v4'
import { ColorContext } from '../context/colorcontext' 
const socket  = require('../connection/socket').socket

/**
 * Onboard is where we create the game room.
 */

class CreateNewGame extends React.Component {
    state = {
        didGetUserName: false,
        inputText: "",
        gameId: ""
    }

    constructor(props) {
        super(props);
        this.textArea = React.createRef();
    }
    
    send = () => {
        /**
         * This method should create a new room in the '/' namespace
         * with a unique identifier. 
         */
        const newGameRoomId = document.getElementById("myRange").value

        // set the state of this component with the gameId so that we can
        // redirect the user to that URL later. 
        this.setState({
            gameId: newGameRoomId
        })

        // emit an event to the server to create a new room 
        socket.emit('createNewGame', newGameRoomId)
    }

    typingUserName = () => {
        // grab the input text from the field from the DOM 
        const typedText = this.textArea.current.value
        
        // set the state with that text
        this.setState({
            inputText: typedText
        })
    }

    render() {
        // !!! TODO: edit this later once you have bought your own domain. 

        return (<React.Fragment>
            {
                this.state.didGetUserName ? 

                <Redirect to = {"/game/" + this.state.gameId}><button className="btn btn-success" style = {{marginLeft: String((window.innerWidth / 2) - 60) + "px", width: "120px"}}>Start Game</button></Redirect>

            :
               <div>
                   <h1 style={{textAlign: "center", marginTop: "17px"}}>Create A Game</h1>
                    <h1 style={{textAlign: "center", marginTop: String((window.innerHeight / 3)-150) + "px"}}>Your Username:</h1>

                    <input placeholder='Input Your Name' style={{marginLeft: String((window.innerWidth / 2) - 120) + "px", width: "240px", marginTop: "22px"}} 
                           ref = {this.textArea}
                           onInput = {this.typingUserName}></input>
                           
                
                           
                    <h1 style={{textAlign: "center", marginTop:"20px"}}>Your Room:<span id="roomnumber"></span></h1>  
                    <h5 style={{textAlign: "center", marginTop: "7px"}}>(defaults to 50)</h5>
                    
                    <input type="range" min="1" max="100" class="slider" id="myRange" onChange={(_, value) =>  document.getElementById("roomnumber").innerHTML = " " + document.getElementById("myRange").value}
                            style={{marginLeft: String((window.innerWidth / 2) - 390/2) + "px", width: "390px", marginTop: "42px"}}/>

                    
                    
                           
                    <button className="btn btn-primary" 
                        style = {{marginLeft: String((window.innerWidth / 2) - 60) + "px", width: "120px", marginTop: "42px"}} 
                        disabled = {!(this.state.inputText.length > 0)} 
                        onClick = {() => {
                            // When the 'Submit' button gets pressed from the username screen,
                            // We should send a request to the server to create a new room with
                            // the uuid we generate here.
                            this.props.didRedirect() 
                            this.props.setUserName(this.state.inputText) 
                            this.setState({
                                didGetUserName: true
                            })
                            this.send()
                        }}>Create Room</button>
                </div>
            }
            </React.Fragment>)
    }
}

const Onboard = (props) => {
    const color = React.useContext(ColorContext)

    return <CreateNewGame didRedirect = {color.playerDidRedirect} setUserName = {props.setUserName}/>
}


export default Onboard