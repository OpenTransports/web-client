import { Store, combineReducers, createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { composeWithDevTools } from 'redux-devtools-extension';

import { servers       , ServersState    } from './servers'
import { transports    , TransportsState } from './transports'
import { agencies      , AgenciesState   } from './agencies'
import { userPosition  , PositionState   } from './position'
import { drawers       , DrawersState    } from './drawers'
import { radius        , RadiusState     } from './radius'


export interface RootState extends Store<{}> {
	userPosition: PositionState
	servers     : ServersState
	agencies    : AgenciesState
	transports  : TransportsState
	drawers     : DrawersState
	radius      : number
}


export default function configureStore(preloadedState?: any) {
	return createStore(
		combineReducers({
			servers,
			agencies,
			transports,
			userPosition,
			drawers,
			radius,
		}),
		preloadedState,
		composeWithDevTools(
			applyMiddleware(
				thunkMiddleware,
				createLogger()
			)
		)
	)
}
