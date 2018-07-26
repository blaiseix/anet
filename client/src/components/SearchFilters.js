import React from 'react'
import pluralize from 'pluralize'

import Settings from 'Settings'

import ReportStateSearch from 'components/advancedSearch/ReportStateSearch'
import DateRangeSearch from 'components/advancedSearch/DateRangeSearch'
import AutocompleteFilter from 'components/advancedSearch/AutocompleteFilter'
import OrganizationFilter from 'components/advancedSearch/OrganizationFilter'
import PositionTypeSearchFilter from 'components/advancedSearch/PositionTypeSearchFilter'
import SelectSearchFilter from 'components/advancedSearch/SelectSearchFilter'
import TextInputFilter from 'components/advancedSearch/TextInputFilter'
import CheckboxSearchFilter from 'components/advancedSearch/CheckboxSearchFilter'

import {Location, Person, Task, Position, Organization, Tag} from 'models'

const taskFilters = props => {
	const taskFiltersObj = {
		Organization: {
			component: OrganizationFilter,
			props: {
				queryKey: "responsibleOrgId",
				queryIncludeChildOrgsKey: "includeChildrenOrgs",
			}
		},
		Status: {
			component: SelectSearchFilter,
			props: {
				queryKey: "status",
				values: [Task.STATUS.ACTIVE, Task.STATUS.INACTIVE],
				labels: ["Active", "Inactive"],
			}
		}
	}
	const projectedCompletion = Settings.fields.task.projectedCompletion
	if (projectedCompletion) {
		taskFiltersObj[projectedCompletion.label] = {
			component: DateRangeSearch,
			props: {
				queryKey: "projectedCompletion",
			}
		}
	}
	const plannedCompletion = Settings.fields.task.plannedCompletion
	if (plannedCompletion) {
		taskFiltersObj[plannedCompletion.label] = {
			component: DateRangeSearch,
			props: {
				queryKey: "plannedCompletion",
			}
		}
	}
	const customEnum1 = Settings.fields.task.customFieldEnum1
	if (customEnum1) {
		taskFiltersObj[customEnum1.label] = {
			component: SelectSearchFilter,
			props: {
				queryKey: "projectStatus",
				values: Object.keys(customEnum1.enum),
				labels: Object.values(customEnum1.enum),
			}
		}
	}
	const customField = Settings.fields.task.customField
	if (customField) {
		taskFiltersObj[customField.label] = {
			component: TextInputFilter,
			props: {
				queryKey: "customField",
			}
		}
	}

	return taskFiltersObj
}

export default {
	searchFilters: function(positionTypeFilterRef, organizationFilterRef) {
		const filters = {}
		filters.Reports = {
			filters: {
				Author: {
					component: AutocompleteFilter,
					props: {
						queryKey: "authorId",
						objectType: Person,
						valueKey: "name",
						fields: Person.autocompleteQuery,
						template: Person.autocompleteTemplate,
						queryParams: {role: Person.ROLE.ADVISOR},
						placeholder: "Filter reports by author...",
					}
				},
				Attendee: {
					component: AutocompleteFilter,
					props: {
						queryKey: "attendeeId",
						objectType: Person,
						valueKey: "name",
						fields: Person.autocompleteQuery,
						template: Person.autocompleteTemplate,
						placeholder: "Filter reports by attendee...",
					}
				},
				"Pending approval of": {
					component: AutocompleteFilter,
					props: {
						queryKey: "pendingApprovalOf",
						objectType: Person,
						valueKey: "name",
						fields: Person.autocompleteQuery,
						template: Person.autocompleteTemplate,
						queryParams: {role: Person.ROLE.ADVISOR},
						placeholder: "Filter reports pending approval of...",
					}
				},
				"Author Position": {
					component: AutocompleteFilter,
					props: {
						queryKey: "authorPositionId",
						objectType: Position,
						valueKey: "name",
						fields: Position.autocompleteQuery,
						template: Position.autocompleteTemplate,
						queryParams: {type: [Position.TYPE.ADVISOR, Position.TYPE.SUPER_USER, Position.TYPE.ADMINISTRATOR]},
						placeholder: "Filter reports by author position...",
					}
				},
				"Attendee Position": {
					component: AutocompleteFilter,
					props: {
						queryKey: "attendeePositionId",
						objectType: Position,
						valueKey: "name",
						fields: Position.autocompleteQuery,
						template: Position.autocompleteTemplate,
						placeholder: "Filter reports by attendee position...",
					}
				},
				Organization: {
					component: OrganizationFilter,
					props: {
						queryKey: "orgId",
						queryIncludeChildOrgsKey: "includeOrgChildren",
					}
				},
				"Engagement Date": {
					component: DateRangeSearch,
					props: {
						queryKey: "engagementDate",
					}
				},
				"Release Date": {
					component: DateRangeSearch,
					props: {
						queryKey: "releasedAt",
					}
				},
				"Update Date": {
					component: DateRangeSearch,
					props: {
						queryKey: "updatedAt",
					}
				},
				Location: {
					component: AutocompleteFilter,
					props: {
						queryKey: "locationId",
						objectType: Location,
						valueKey: "name",
						fields: Location.autocompleteQuery,
						placeholder: "Filter reports by location...",
					}
				},
				State: {
					component: ReportStateSearch,
				},
				Atmospherics: {
					component: SelectSearchFilter,
					props: {
						queryKey: "atmosphere",
						values: ["POSITIVE","NEUTRAL","NEGATIVE"],
					}
				},
				Tag: {
					component: AutocompleteFilter,
					props: {
						queryKey: "tagId",
						objectType: Tag,
						valueKey: "name",
						fields: Tag.autocompleteQuery,
						placeholder: "Filter reports by tag...",
					}
				},
				"Sensitive info": {
					component: CheckboxSearchFilter,
					props: {
						queryKey: "sensitiveInfo",
					}
				},
			}
		}

		const taskShortLabel = Settings.fields.task.shortLabel
		filters.Reports.filters[taskShortLabel] = {
			component: AutocompleteFilter,
			props: {
				queryKey: "taskId",
				objectType: Task,
				valueKey: "shortName",
				fields: Task.autocompleteQuery,
				template: Task.autocompleteTemplate,
				placeholder: `Filter reports by ${taskShortLabel}...`,
			}
		}

		const countries = Settings.fields.advisor.person.countries || [] // TODO: make search also work with principal countries
		filters.People = {
			filters: {
				Organization: {
					component: OrganizationFilter,
					props: {
						queryKey: "orgId",
						queryIncludeChildOrgsKey: "includeChildOrgs",
					}
				},
				Role: {
					component: SelectSearchFilter,
					props: {
						queryKey: "role",
						values: [Person.ROLE.ADVISOR,Person.ROLE.PRINCIPAL],
						labels: [Settings.fields.advisor.person.name, Settings.fields.principal.person.name],
					}
				},
				Status: {
					component: SelectSearchFilter,
					props: {
						queryKey: "status",
						values: [Person.STATUS.ACTIVE, Person.STATUS.INACTIVE, Person.STATUS.NEW_USER],
					}
				},
				Location: {
					component: AutocompleteFilter,
					props: {
						queryKey: "locationId",
						objectType: Location,
						valueKey: "name",
						fields: Location.autocompleteQuery,
						placeholder: "Filter by location...",
					}
				},
				Nationality: {
					component: SelectSearchFilter,
					props: {
						queryKey: "country",
						values: countries,
						labels: countries,
					}
				}
			}
		}

		filters.Organizations = {
			filters: {
				Status: {
					component: SelectSearchFilter,
					props: {
						queryKey: "status",
						values: [Organization.STATUS.ACTIVE, Organization.STATUS.INACTIVE],
					}
				},
				"Organization type": {
					component: SelectSearchFilter,
					props: {
						queryKey: "type",
						values: [Organization.TYPE.ADVISOR_ORG, Organization.TYPE.PRINCIPAL_ORG],
						labels: [Settings.fields.advisor.org.name, Settings.fields.principal.org.name],
					}
				}
			}
		}

		filters.Positions = {
			filters: {
				"Position type": {
					component: PositionTypeSearchFilter,
					props: {
						queryKey: "type",
						values: [Position.TYPE.ADVISOR, Position.TYPE.PRINCIPAL],
						labels: [Settings.fields.advisor.position.name, Settings.fields.principal.position.name],
						ref: positionTypeFilterRef,
					}
				},
				Organization: {
					component: OrganizationFilter,
					props: {
						queryKey: "organizationId",
						queryIncludeChildOrgsKey: "includeChildrenOrgs",
						ref: organizationFilterRef,
					}
				},
				Status: {
					component: SelectSearchFilter,
					props: {
						queryKey: "status",
						values: [Position.STATUS.ACTIVE, Position.STATUS.INACTIVE],
					}
				},
				Location: {
					component: AutocompleteFilter,
					props: {
						queryKey: "locationId",
						objectType: Location,
						valueKey: "name",
						fields: Location.autocompleteQuery,
						placeholder: "Filter by location...",
					}
				},
				"Is filled?": {
					component: SelectSearchFilter,
					props: {
						queryKey: "isFilled",
						values: ["true","false"],
						labels: ["Yes","No"],
					}
				}
			}
		}

		filters.Locations = {
			filters: {
				Status: {
					component: SelectSearchFilter,
					props: {
						queryKey: "status",
						values: [Location.STATUS.ACTIVE, Location.STATUS.INACTIVE],
					}
				}
			}
		}

		//Task filters
		filters[pluralize(taskShortLabel)] = {
			filters: taskFilters()
		}

		return filters
	}
}
