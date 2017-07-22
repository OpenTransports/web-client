import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { rootReducer } from './reducers/opentransports'
import { composeWithDevTools } from 'redux-devtools-extension';

const loggerMiddleware = createLogger()

export default function configureStore(preloadedState?: any) {
	return createStore(
		rootReducer,
		preloadedState,
		composeWithDevTools(
			applyMiddleware(
				thunkMiddleware,
				loggerMiddleware
			)
		)
	)
}
