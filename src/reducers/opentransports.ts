import { combineReducers, Store } from 'redux'

import { transports, TransportsState } from './transports'
import { agencies  , AgenciesState   } from './agencies'
import { position  , PositionState   } from './position'
import { drawers   , DrawersState    } from './drawers'
import { radius    , RadiusState     } from './radius'


export interface OTState extends Store<{}> {
	position   : PositionState,
	agencies   : AgenciesState,
	transports : TransportsState,
	drawers    : DrawersState
	radius     : number,
}

export const rootReducer = combineReducers({
	agencies,
	transports,
	position,
	drawers,
	radius,
})
