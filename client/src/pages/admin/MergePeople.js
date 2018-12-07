import React from 'react'
import Page, {mapDispatchToProps, jumpToTop, propTypes as pagePropTypes} from 'components/Page'

import { Formik, Form, Field } from 'formik'
import * as FieldHelper from 'components/FieldHelper'

import Breadcrumbs from 'components/Breadcrumbs'
import {Grid, Col, Row, Alert, Button, Checkbox} from 'react-bootstrap'
import Autocomplete from 'components/Autocomplete'
import LinkTo from 'components/LinkTo'
import moment from 'moment'
import Messages from 'components/Messages'

import Settings from 'Settings'
import {Person} from 'models'

import API from 'api'

import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

class MergePeople extends Page {

	static propTypes = {...pagePropTypes}

	state = {
		success: null,
		error: null,
		winner: {},
		loser: {},
		copyPosition: false
	}

	render() {
		let {winner, loser, copyPosition} = this.state
		let errors = this.validate()

		let personFields = `uuid, name, emailAddress, domainUsername, createdAt, role, status, rank,
			position { uuid, name, organization { uuid, shortName, longName, identificationCode }},
			authoredReports(pageNum:0,pageSize:1) { totalCount }
			attendedReports(pageNum:0,pageSize:1) { totalCount }`

		return (
			<div>
				<Breadcrumbs items={[['Merge People Tool', '/admin/mergePeople']]} />
				<Messages error={this.state.error} success={this.state.success} />

				<h2 className="form-header">Merge People Tool</h2>
				<Alert bsStyle="warning">
					<p><b>Important</b>: Select the two duplicative people below. The loser account will
					be deleted and all reports will be transferred over to the winner.  </p>
				</Alert>
				<Grid fluid>
					<Row>
						<Col md={6}>
							<Row>
								<h2>Loser</h2>
							</Row>
							<Row>
								<Autocomplete valueKey="name"
									value={loser}
									placeholder="Select the duplicate person"
									objectType={Person}
									fields={personFields}
									template={person =>
										<LinkTo person={person} isLink={false} />
									}
									onChange={this.selectLoser}
								/>
							</Row>
							<Row>
								{loser.uuid &&
									<fieldset>{this.showPersonDetails(new Person(loser))}</fieldset>
								}
							</Row>
						</Col>
						<Col md={6}>
							<Row>
								<h2>Winner</h2>
							</Row>
							<Row>
								<Autocomplete valueKey="name"
									value={winner}
									placeholder="Select the OTHER duplicate person"
									objectType={Person}
									fields={personFields}
									template={person =>
										<LinkTo person={person} isLink={false} />
									}
									onChange={this.selectWinner}
								/>
							</Row>
							<Row>
								{winner.uuid &&
									<fieldset>{this.showPersonDetails(new Person(winner))}</fieldset>
								}
							</Row>
						</Col>
					</Row>
					<Row>
						<Col md={12} >
							{errors.length === 0 && loser.position && !winner.position &&
								<Checkbox value={copyPosition} onChange={this.toggleCopyPosition} >
									Set position on winner to {loser.position.name}
								</Checkbox>
							}
							{loser.position && winner.position &&
								<Alert bsStyle="danger">
									<b>Danger:</b> Position on Loser ({loser.position.name}) will be left unfilled
								</Alert>
							}
						</Col>
					</Row>
					<Row>
						<Col md={12}>
						{errors.length > 0 &&
								<Alert bsStyle="danger">
									<ul>
									{errors.map((error, index) =>
										<li key={index} >{error}</li>
									)}
									</ul>
								</Alert>
							}
							<Button bsStyle="primary" bsSize="large" block onClick={this.submit} disabled={errors.length > 0} >
								Merge People
							</Button>
						</Col>
					</Row>
				</Grid>
			</div>
		)
	}

	selectLoser = (loser) => {
		this.setState({loser: loser})
	}

	selectWinner = (winner) => {
		this.setState({winner: winner})
	}

	toggleCopyPosition = () => {
		this.setState({copyPosition: !this.state.copyPosition})
	}

	validate = () => {
		let {winner, loser} = this.state
		let errors = []

		if (!winner.uuid || !loser.uuid) {
			errors.push("You must select two people")
			return errors
		}
		if (winner.uuid === loser.uuid) {
			errors.push("You selected the same person twice!")
		}
		if (winner.role !== loser.role) {
			errors.push(`You can only merge people of the same Role (i.e. ${Settings.fields.advisor.person.name}/${Settings.fields.principal.person.name})`)
		}

		return errors
	}

	showPersonDetails = (person) => {
		return <Formik initialValues={person}>
			{({values,}) => (
				<Form>
					<Field
						name="uuid"
						component={FieldHelper.renderReadonlyField}
						vertical={true}
					/>
					<Field
						name="name"
						component={FieldHelper.renderReadonlyField}
						vertical={true}
					/>
					<Field
						name="status"
						component={FieldHelper.renderReadonlyField}
						humanValue={person.humanNameOfStatus()}
						vertical={true}
					/>
					<Field
						name="role"
						component={FieldHelper.renderReadonlyField}
						humanValue={person.humanNameOfRole()}
						vertical={true}
					/>
					<Field
						name="rank"
						component={FieldHelper.renderReadonlyField}
						vertical={true}
					/>
					<Field
						name="emailAddress"
						component={FieldHelper.renderReadonlyField}
						vertical={true}
					/>
					<Field
						name="domainUsername"
						component={FieldHelper.renderReadonlyField}
						vertical={true}
					/>
					<Field
						name="createdAt"
						component={FieldHelper.renderReadonlyField}
						humanValue={person.createdAt && moment(person.createdAt).format("DD MMM YYYY HH:mm:ss")}
						vertical={true}
					/>
					<Field
						name="position"
						component={FieldHelper.renderReadonlyField}
						humanValue={person.position && <LinkTo position={person.position} />}
						vertical={true}
					/>
					<Field
						name="organization"
						component={FieldHelper.renderReadonlyField}
						humanValue={person.position && <LinkTo organization={person.position.organization} />}
						vertical={true}
					/>
					<Field
						name="numReports"
						label="Number of Reports Written"
						component={FieldHelper.renderReadonlyField}
						humanValue={person.authoredReports && person.authoredReports.totalCount}
						vertical={true}
					/>
					<Field
						name="numReportsIn"
						label="Number of Reports Attended"
						component={FieldHelper.renderReadonlyField}
						humanValue={person.attendedReports && person.attendedReports.totalCount}
						vertical={true}
					/>
				</Form>
			)}
		</Formik>
	}

	submit = (event) => {
		event.stopPropagation()
		event.preventDefault()
		let {winner, loser, copyPosition} = this.state
		let operation = 'mergePeople'
		let graphql = operation + '(winnerUuid: $winnerUuid, loserUuid: $loserUuid, copyPosition: $copyPosition)'
		const variables = {
				winnerUuid: winner.uuid,
				loserUuid: loser.uuid,
				copyPosition: copyPosition
		}
		const variableDef = '($winnerUuid: String!, $loserUuid: String!, $copyPosition: Boolean!)'
		API.mutation(graphql, variables, variableDef, {disableSubmits: true})
			.then(data => {
				if (data[operation]) {
					this.props.history.push({
						pathname: Person.pathFor(this.state.winner),
						state: {success: 'People merged'}
					})
				}
			}).catch(error => {
				this.setState({success: null, error: error})
				jumpToTop()
				console.error(error)
			})
	}

}

export default connect(null, mapDispatchToProps)(withRouter(MergePeople))
