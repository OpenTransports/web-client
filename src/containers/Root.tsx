import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
// TODO - stay alert and remove when this become unecessary
injectTapEventPlugin();

import '../env'
import "./main.css"

import configureStore from '../reducers/configureStore'
import AsyncApp from './AsyncApp'

const store = configureStore()

ReactDOM.render(
	<Provider store={store}>
		<BrowserRouter>
			<MuiThemeProvider>
				<AsyncApp/>
			</MuiThemeProvider>
		</BrowserRouter>
	</Provider>,
	document.getElementById('root')
);
