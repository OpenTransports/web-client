import * as React from 'react'
import DirectionIcon from 'material-ui/svg-icons/maps/directions'

import { greenA700, grey500 } from 'material-ui/styles/colors'
import { Transport, Position } from '../../models'
import { capitalize } from '../../filters'

import './style.css'

interface TransportsProps {
	transport   : Transport
	userPosition: Position
}

export default class Transports extends React.Component<TransportsProps, any> {

	constructor(props: TransportsProps) {
		super(props)
		this.state = { isOpen: false }
		this.handleClick = this.handleClick.bind(this)
	}

	handleClick() {
		this.setState(prevState => ({
			isOpen: !prevState.isOpen
		}))
	}

	render() {
		const { transport, userPosition } = this.props
		const containerClasses = `transport-container ${this.state.isOpen ? 'transport-container-open':''}`
		const iconURL = `${transport.serverURL}/medias/${transport.agencyID}/${transport.image}`
		return (
			<div
				className={containerClasses}
				onClick={this.handleClick}
			>
				<div className="transport-header">
					<span
						className="transport-icon"
						style={{backgroundImage: `url(${iconURL})`}}
					></span>
					<span className="transport-name">{capitalize(transport.name)}</span>
					<span
						className="transport-distance"
						style={{color: grey500}}
					>
						<DirectionIcon style={{width: 16, height: 16, marginRight: 5}} color={grey500}/>
						{transport.position.distanceFrom(userPosition)} m
					</span>
				</div>

				{transport.passages.map(p =>
					<div className="transport-passages-container" key={p.direction}>
						<div className="transport-passages-direction">{p.direction}</div>
						<div className="transport-passages-times-container">
							{p.times
								.filter((t, i)=> this.state.isOpen || i < 1)
								.map((t, i) =>
									<div
										style={{color: greenA700}}
										className="transport-passages-time"
										key={i}
									>
										{t}
									</div>
								)}
						</div>
					</div>
				)}
			</div>
		)
	}
}
