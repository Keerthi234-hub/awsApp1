import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import DestinationSearch from './DestinationSearch';
import DestinationDetail from './DestinationDetail';
import Booking from './Booking';
import Profile from './Profile';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="container">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/search" component={DestinationSearch} />
            <Route path="/destination/:id" component={DestinationDetail} />
            <Route path="/booking/:destinationId" component={Booking} />
            <Route path="/profile" component={Profile} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;