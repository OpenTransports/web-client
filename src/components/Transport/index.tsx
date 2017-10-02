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
		const iconURL: string = transport.iconURL || agency.types[transport.type].icon
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
						onClick={() => onDirectionRequest(transport.id)}
					>
						{transport.position.distanceFrom(userPosition)} m
						<DirectionIcon
							style={{width: 16, height: 16, marginLeft: 5}}
							color={grey500}
						/>
					</span>
				</div>

				{transport.informations && transport.informations.map(info =>
					<div className="transport-informations-container" key={info.title}>
						<div className="transport-informations-title">{info.title}</div>
						<div className="transport-informations-times-container">
							{info.content
								.filter((content, i)=> this.state.isOpen || i < 1)
								.map((content, i) =>
									<div
										className={`
											transport-informations-time
											${info.timestamp ? 'transport-informations-real-time' : ''}
											${info.warn ? 'transport-informations-warning' : ''}
										`}
										key={i}
									>
										{content}
									</div>
								)
							}
						</div>
					</div>
				)}
			</div>
		)
	}
}
