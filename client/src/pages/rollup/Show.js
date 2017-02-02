import React from 'react'
import Page from 'components/Page'
import autobind from 'autobind-decorator'
import moment from 'moment'

import {DropdownButton, MenuItem} from 'react-bootstrap'
import Breadcrumbs from 'components/Breadcrumbs'
import ScrollableFieldset from 'components/ScrollableFieldset'
import History from 'components/History'
import ReportCollection from 'components/ReportCollection'
import ReportSummary from 'components/ReportSummary'

import API from 'api'
import {Report} from 'models'

var d3 = null/* required later */

const graphCss = {
	width: '100%',
	height: '300px'
}

const barColors = {
	verified: '#9CBDA4',
	unverified: '#F5D98C',
	incoming: '#DA9795',
}

export default class RollupShow extends Page {
	static propTypes = {
		date: React.PropTypes.object,
	}

	static defaultProps = {
		date: moment(),
	}

	static contextTypes = {
		app: React.PropTypes.object.isRequired,
	}

	get dateStr() { return this.props.date.format('DD MMM YYYY') }
	get dateLongStr() { return this.props.date.format('DD MMMM YYYY') }
	get rollupStart() { return this.props.date.startOf('day') }
	get rollupEnd() { return this.props.date.endOf('day') }

	constructor(props) {
		super(props)
		this.state = {
			date: {},
			reports: [],
		}
	}

	componentDidMount() {
		super.componentDidMount()

		if (d3)
			return

		require.ensure([], () => {
			d3 = require('d3')
			this.forceUpdate()
		})
	}

	fetchData(props) {
		// TODO: this is a hack to make sure we get some data, I am not using the
		API.query(/* GraphQL */`
			reports(f:releasedToday) {
				id, state, intent, engagementDate, intent, keyOutcomes, nextSteps
				author { id, name }
				location { id, name, lat, lng}
				poams { id, longName }
				comments { id }
				primaryAdvisor {
					id, name, rank
					position { organization { id, shortName, longName }}
				}
				primaryPrincipal {
					id, name, rank
					position { organization { id, shortName, longName }}
				}
				advisorOrg {
					id, shortName
					parentOrg { id, shortName }
				}
			}
		`).then(data => {
			this.setState({reports: Report.fromArray(data.reports)})
		})
	}

	componentDidUpdate() {
		let {reports} = this.state
		if (!reports || !d3)
			return

		// Sets up the data
		var step1 = d3.nest()
				.key(function(d){return (d.advisorOrg && d.advisorOrg.shortName);})
				.rollup(function(d){return {l:d.length,s:d[0].state,r:d}})
				.entries(reports)

		var svg = d3.select(this.graph),
			margin = {top: 20, right: 20, bottom: 20, left: 20},
			width = this.graph.clientWidth - margin.left - margin.right,
			height = this.graph.clientHeight - margin.top - margin.bottom,
			padding = 22,
			g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var x = d3.scaleBand().rangeRound([0,width])

		var y = d3.scaleLinear()
			.rangeRound([height, 0]);

		x.domain(step1.map(function(d){return d.key}));
		y.domain([0,d3.max(step1.map(function(d){return d.value.l}))]);
		d3.line()
			.x(function(d,i) { return x(d.key); })
			.y(function(d,i) { return y(d.value); });

		var xAxis = d3.axisBottom()
			.scale(x);
		var maxValue = d3.max(step1.map(function(d){
					return d.value.l
				  }));
		var yAxis = d3.axisLeft()
			.scale(y).ticks(Math.min(maxValue+1,10));

		g.append("g")
			.attr("transform", "translate(0," + height + ")")
			.attr("fill", "#000")
			.call(xAxis);

		g.append("g")
			.attr("fill", "#400")
			.call(yAxis)
			.append("text")
			.attr("fill", "#000")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", "0.71em")
			.style("text-anchor", "end")
			.text("# of Reports");

		g.selectAll(".bar")
			.data(step1)
			.enter().append("rect")
			.attr("class", "line")
			.attr("width", width / step1.length - padding)
			.attr("x",function(d,i){return x(d.key) + (width / (step1.length + padding))})
			.attr("height", function(d,i){return height - y(d.value.l)})
			.attr("y",function(d,i){return y(d.value.l) })
			.attr("fill", function(d){return barColors.verified})
	}

	render() {
		let {reports} = this.state
		let reportOTD = null; //reports[0]

		// Admins can edit poams, or super users if this poam is assigned to their org.
		let currentUser = this.context.app.state.currentUser
		let canEdit = currentUser && currentUser.isAdmin()

		return (
			<div>
				<Breadcrumbs items={[['Rollup', ''],[this.dateStr, 'rollup/' +this.dateStr]]} />

				{canEdit &&
					<div className="pull-right">
						<DropdownButton bsStyle="primary" title="Actions" id="actions" className="pull-right" onSelect={this.actionSelect}>
							<MenuItem eventKey="edit" >Edit</MenuItem>
						</DropdownButton>
					</div>
				}

				<h1>Daily Rollup - {this.dateLongStr}</h1>

				<fieldset>
					<legend>Summary of Report Input</legend>
					<svg ref={el => this.graph = el} style={graphCss} />
				</fieldset>

				{reportOTD && <fieldset>
					<legend>Report of the Day</legend>

					<ReportSummary report={reportOTD} />
				</fieldset>}

				<ScrollableFieldset title={`Reports - ${this.dateLongStr}`} height={400}>
					<ReportCollection reports={reports} />
				</ScrollableFieldset>
			</div>
		)
	}

	@autobind
	actionSelect(eventKey, event) {
		if (eventKey === "edit") {
			History.push(`/report/${this.state.report.id}/edit`);
		} else {
			console.log("Unimplemented Action: " + eventKey);
		}
	}
}