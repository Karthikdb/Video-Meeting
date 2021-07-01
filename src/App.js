import React, { Component } from 'react'
import Video from './Video'
import Home from './Home';
import { Provider } from 'react-redux';
import Store from "./Store/Store";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

class App extends Component {
	render() {
		return (
			<Provider store={Store}>
			<div>
				<Router>
					<Switch>
						<Route path="/" exact component={Home} />
						<Route path="/:url" component={Video} />
					</Switch>
				</Router>
			</div>
			</Provider>
		)
	}
}

export default App;