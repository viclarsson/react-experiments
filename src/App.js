import React, { Component } from 'react';

// Route
import { Route, Switch } from 'react-router'

// Routes
import Index from './routes';
import Demo from './routes/demo';

// Components
import StateComponent from './components/StateComponent';

class App extends Component {
  render() {
    return (
      <div className="measure center">
        <StateComponent />
        <Switch>
          <Route exact path="/" component={Index}/>
          <Route path="/demo" component={Demo}/>
        </Switch>
      </div>
    );
  }
}
export default App;
