import * as React from 'react'
import DirectionIcon from 'material-ui/svg-icons/maps/directions'

import { greenA700, grey500 } from 'material-ui/styles/colors'
import { Agency, Transport, Position } from '../../models'
import { capitalize } from '../../filters'

import './style.css'

interface TransportsProps {
	agency            : Agency
	transport         : Transport
	userPosition      : Position
	onDirectionRequest: (transportID: string) => void
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
		const { agency, transport, userPosition, onDirectionRequest } = this.props
		const containerClasses = `transport-container ${this.state.isOpen ? 'transport-container-open':''}`
		// If the custom one is null, fall back to the generic one
		const iconURL = transport.iconURL || agency.iconsURL[agency.types.indexOf(transport.type)]
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
						onClick={() => onDirectionRequest(transport.ID)}
					>
						{transport.position.distanceFrom(userPosition)} m
						<DirectionIcon
							style={{width: 16, height: 16, marginLeft: 5}}
							color={grey500}
						/>
					</span>
				</div>

				{transport.passages && transport.passages.map(p =>
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

				{transport.available &&
					<div className="transport-count-container">
						<div className="transport-count">
							<div className="transport-count-label">Available</div>
							<div className={`transport-count-number transport-count-number-${transport.available > 3 ? 'ok' : 'warning'}`}>
								{transport.available}
							</div>
						</div>
						<div className="transport-count">
							<div className="transport-count-label">Empty spots</div>
							<div className={`transport-count-number transport-count-number-${transport.empty > 2 ? 'ok' : 'warning'}`}>
								{transport.empty}
							</div>
						</div>
					</div>
				}
			</div>
		)
	}
}
