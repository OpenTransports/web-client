import { Store, combineReducers, createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { composeWithDevTools } from 'redux-devtools-extension'
import { persistStore, autoRehydrate } from 'redux-persist'

import {
	servers     , ServersState,
	transports  , TransportsState,
	agencies    , AgenciesState,
	userPosition, PositionState,
	drawers     , DrawersState,
	radius      , RadiusState,
	itineraries , ItinerariesState,
	linesRoutes , LinesRoutesState } from '.'


export interface RootState extends Store<{}> {
	userPosition: PositionState
	servers     : ServersState
	agencies    : AgenciesState
	transports  : TransportsState
	drawers     : DrawersState
	radius      : RadiusState
	itineraries : ItinerariesState
	linesRoutes : LinesRoutesState
}


export default function configureStore(preloadedState?: any) {
	const store = createStore(
		combineReducers({
			servers,
			agencies,
			transports,
			userPosition,
			drawers,
			radius,
			itineraries,
			linesRoutes,
		}),

		preloadedState,

		composeWithDevTools(
			autoRehydrate(),
			applyMiddleware(
				thunkMiddleware,
				createLogger(),
			),
		)
	)

	persistStore(store, {whitelist: ["agencies", "linesRoutes", "radius"]})

	return store
}
