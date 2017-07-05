import React, { Component } from 'react';
import update from 'immutability-helper';
import logo from './logo.svg';
import './App.css';
import KanbanBoard from './KanbanBoard.js';
import 'whatwg-fetch';

const API_URL = 'http://kanbanapi.pro-react.com';
const API_HEADER = {
  'Content-Type': 'application/json',
  'Authorization': 'jojo-kanban'
}

class App extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      cards : []
    }
  }

  componentDidMount() {
    fetch(API_URL+'/cards', {headers: API_HEADER})
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          cards : responseData
        })
      })
      .catch((error) => {
        console.log(('Error fetching and parsing data', error));
      })
  }

  addTask(cardId, taskName) {
    let cardIndex = this.state.cards.findIndex((card) => card.id == cardId);

    let newTask = {id:Date.now(), name:taskName, done:false};

    let nextState = update(this.state.cards, {
      [cardIndex] : {
        tasks : {$push : [newTask]}
      }
    });

    this.setState({cards : nextState});

    fetch(API_URL + "/cards/"+ cardId + "/tasks/", {
      method:'post',
      headers: API_HEADER,
      body: JSON.stringify(newTask)
    })
    .then((response) => response.json())
    .then((responseData) => {
      newTask.id=responseData.id;
      this.setState({cards:nextState});
    });
  }

  deleteTask(cardId, taskId, taskIndex) {
    let cardIndex = this.state.cards.findIndex((card) => card.id == cardId);

    let nextState = update(this.state.cards, {
      [cardIndex] : {
        tasks : {$splice: [[taskIndex,1]]}
      }
    });

    this.setState({cards : nextState});

    fetch(API_URL + "/cards/"+ cardId + "/tasks/" + taskId, {
      method:'delete',
      headers: API_HEADER
    });

  }

  toggleTask(cardId, taskId, taskIndex) {
    let cardIndex = this.state.cards.findIndex((card) => card.id == cardId);

    let newDoneValue;
    let nextState = update(this.state.cards, {
      [cardIndex] : {
        done:{ $apply:(done)=> {
            newDoneValue=!done
            return newDoneValue; 
          } 
        }
      }
    });    

    this.setState({cards : nextState});

    fetch(API_URL + "/cards/"+ cardId + "/tasks/" + taskId, {
      method:'put',
      headers: API_HEADER,
      body: JSON.stringify({done:newDoneValue})
    });
  }

  render() {
    return (
      <KanbanBoard cards={this.state.cards} 
        taskCallbacks={{
          toggle : this.toggleTask.bind(this),
          delete : this.deleteTask.bind(this),
          add : this.addTask.bind(this),
        }}/>
        
      // <div className="App">
      //   <div className="App-header">
      //     <img src={logo} className="App-logo" alt="logo" />
      //     <h2>Welcome to React</h2>
      //   </div>
      //   <p className="App-intro">
      //     To get started, edit <code>src/App.js</code> and save to reload.
      //   </p>
      // </div>
    );
  }
}

export default App;
