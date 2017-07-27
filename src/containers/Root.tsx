import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import * as injectTapEventPlugin from 'react-tap-event-plugin'
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
// TODO - stay alert and remove when this become unecessary
injectTapEventPlugin();

import "./main.css"

import configureStore from '../reducers/configureStore'
import AsyncApp from './AsyncApp'

const store = configureStore()

ReactDOM.render(
	<Provider store={store}>
		<MuiThemeProvider>
			<AsyncApp/>
		</MuiThemeProvider>
	</Provider>,
	document.getElementById('root')
);
