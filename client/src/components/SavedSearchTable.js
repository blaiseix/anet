import React, {Component, PropTypes} from 'react'
import autobind from 'autobind-decorator'

import ReportCollection from 'components/ReportCollection'

import API from 'api'

export default class SavedSearchTable extends Component {
	static propTypes = {
		searchId: PropTypes.any.isRequired,
	}

	constructor(props) {
		super(props)

		this.state = {
			searchResults: {
				reports: []
			}
		}

		if (props.searchId) {
			this.runSearch(props.searchId);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.searchId && (nextProps.searchId !== this.props.searchId)) {
			this.runSearch(nextProps.searchId)
		}
	}

	@autobind
	runSearch(searchId) {
		API.query(/*GraphQL */`
			searchResults(f:runSavedSearch, searchId:${searchId}) {
				reports { id, intent, engagementDate, keyOutcomes, nextSteps
					primaryAdvisor { id, name, role, position { organization { id, shortName}}},
					primaryPrincipal { id, name, role, position { organization { id, shortName}}},
					author{ id, name},
					advisorOrg { id, shortName},
					principalOrg { id, shortName},
					location { id, name},
					poams {id, shortName, longName}
				},
				people { id, name, rank, emailAddress, role , position { id, name, organization { id, shortName} }}
				positions { id , name, type, organization { id, shortName}, person { id, name } }
				poams { id, shortName, longName}
				locations { id, name, lat, lng}
				organizations { id, shortName, longName }
			}
		`).then(data =>
			this.setState({searchResults: data.searchResults})
		)
	}

	render() {
		return <ReportCollection reports={this.state.searchResults.reports} />
	}

}