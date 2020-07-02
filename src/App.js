import React from 'react';
import './App.css';
import {Route, Switch} from "react-router-dom";
import {HomePage} from "./components/HomePage/HomePage";
import {GamePage} from "./components/GamePage/GamePage";
import {combineReducers, createStore} from "redux";
import {gameReducer} from "./redux/reducers/gameReducer";
import {Provider} from "react-redux";

const reducer = combineReducers({
    game: gameReducer,
});

let store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());


function App() {
  return (
      <Provider store={store}>
    <div className="App">
        <Switch>
            <Route path='/game' component={GamePage} />
            <Route path='/' component={HomePage} />
        </Switch>

    </div>
      </Provider>
  );
}

export default App;

