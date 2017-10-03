import React, { Component } from 'react'
import { Table } from 'react-bootstrap'
import AdvisorReportsModal from 'components/AdvisorReports/AdvisorReportsModal'
import AdvisorReportsRow from 'components/AdvisorReports/AdvisorReportsRow'
import AdvisorReportsTableHead from 'components/AdvisorReports/AdvisorReportsTableHead'
import './OrganizationAdvisorsTable.css'

const ADVISORS = [
    {name: 'Derrick Hancock', statistics: [
        {hash:1233, week: 32, reportsSubmitted: 35, engagementsAttended: 5},
        {hash:1234, week: 31, reportsSubmitted: 3, engagementsAttended: 15},
        {hash:1235, week: 30, reportsSubmitted: 32, engagementsAttended: 22}], id: 1},
    {name: 'Abbey Scott', statistics: [
        {hash:1236, week: 32, reportsSubmitted: 2, engagementsAttended: 8},
        {hash:1237, week: 31, reportsSubmitted: 3, engagementsAttended: 15},
        {hash:1238, week: 30, reportsSubmitted: 32, engagementsAttended: 22}], id: 2},
    {name: 'John Smith', statistics: [
        {hash:1239, week:32, reportsSubmitted: 12, engagementsAttended: 35},
        {hash:12310, week: 31, reportsSubmitted: 3, engagementsAttended: 15},
        {hash:12311, week: 30, reportsSubmitted: 32, engagementsAttended: 22}], id: 3},
    {name: 'Chad Choo', statistics: [
        {hash:12312, week: 32, reportsSubmitted: 10, engagementsAttended: 5},
        {hash:12313, week: 31, reportsSubmitted: 3, engagementsAttended: 15},
        {hash:12314, week: 30, reportsSubmitted: 32, engagementsAttended: 22}], id: 4},
    {name: 'Simon Says', statistics: [
        {hash:12315, week: 32,reportsSubmitted: 21, engagementsAttended: 45},
        {hash:12316, week: 31, reportsSubmitted: 3, engagementsAttended: 15},
        {hash:12317, week: 30, reportsSubmitted: 32, engagementsAttended: 22}], id: 5},
    {name: 'Bob Alice', statistics: [
        {hash:12318, week: 32,reportsSubmitted: 33, engagementsAttended: 3},
        {hash:12319, week: 31, reportsSubmitted: 3, engagementsAttended: 15},
        {hash:12320, week: 30, reportsSubmitted: 32, engagementsAttended: 22}], id: 6}
  ] //TODO implement dynamic data

class OrganizationAdvisorsTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            selectedAll: false
        }
        this.handleSelectRow = this.handleSelectRow.bind(this)
        this.handleSelectAllRows = this.handleSelectAllRows.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ data: nextProps.data })
    }

    handleSelectRow(index) {
        let data = this.state.data.slice()
        data[index].selected =  this.toggleRowSelection(index)
        this.setState({ data: data })
    }

    handleSelectAllRows() {
        let toggleSelect = !this.state.selectedAll
        let rows =  this.toggleSelectAllRows(toggleSelect)
        this.setState({ 
            data: rows,
            selectedAll: toggleSelect 
        })
    }

    toggleRowSelection(index) {
        let isRowSelected = this.state.data[index].selected
        return !isRowSelected
    }

    toggleSelectAllRows(selected) {
        let rows = this.state.data.slice()
        rows.forEach( (item) => {
            item.selected = selected
        })
        return rows
    }

    search(rows, filterText) {
        let nothingFound = <tr className="nothing-found"><td colSpan="8">No organizations found...</td></tr>
        let search = rows.filter( (element) => {
            let props = element.props
            let orgName = props.name.toLowerCase()
            return orgName.indexOf( filterText.toLowerCase() ) !== -1
        })
        return ( search.length > 0 ) ? search : nothingFound
    }

    createAdvisorReportsRows(data) {
        return data.map( (organization, index) => {
            let checked = (organization.selected === undefined) ? false : organization.selected
            let modalLink = <AdvisorReportsModal 
                                name={ organization.name } 
                                data={ ADVISORS } 
                                columnGroups={ this.props.columnGroups } />

            return <AdvisorReportsRow
                        link={ modalLink }
                        name={ organization.name }
                        statistics={ organization.stats }
                        checked={ checked }
                        handleOrganizationClick={ () => this.handleOrganizationClick(index) }
                        onSelectRow={ () => this.handleSelectRow(index) }
                        key={ index } />
        })
    }

    render() {
        let rows = this.createAdvisorReportsRows(this.state.data)
        let showRows = (this.props.filterText) ? this.search(rows, this.props.filterText) : rows
        return(
            <div className="organization-advisors-table">
                <Table striped bordered condensed hover responsive>
                    <caption>Shows reports submitted and engagements attended per week by an organizations' advisors</caption>
                    <AdvisorReportsTableHead
                        columnGroups={ this.props.columnGroups } 
                        title="Organization name" 
                        onSelectAllRows={ this.handleSelectAllRows } />
                    <tbody>
                        { showRows }
                    </tbody>
                </Table>
            </div>
        ) 
    }
}

export default OrganizationAdvisorsTable
