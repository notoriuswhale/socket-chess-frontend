import React from 'react';
import './App.css';
import {Game} from "./components/Game/Game";
import {Route, Switch} from "react-router-dom";
import {HomePage} from "./components/HomePage/HomePage";
import {GamePage} from "./components/GamePage/GamePage";

function App() {
  return (
    <div className="App">
        <Switch>
            <Route path='/game' component={GamePage} />
            <Route path='/' component={HomePage} />
        </Switch>

    </div>
  );
}

export default App;

