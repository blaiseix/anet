import React from 'react'
import {Link} from 'react-router'
import {Button} from 'react-bootstrap'

import logo from '../resources/logo.png'

const css = {
	background: 'white',
	// position: 'absolute',
	// left: 0,
	// top: '34px',
	width: '100%',
	height: '124px',
	boxShadow: '0 4px 3px 0 rgba(0,0,0,0.1)',
	marginBottom: '24px'
}

export default class Header extends React.Component {
	render() {
		return (
			<div style={css}>
				<Link to="/">
					<img src={logo} alt="ANET logo" width={200} />
				</Link>

				{this.props.children}

				<Button bsStyle="primary" className="pull-right">Create</Button>
			</div>
		)
	}
}
