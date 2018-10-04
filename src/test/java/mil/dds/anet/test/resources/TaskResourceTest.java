package mil.dds.anet.test.resources;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import javax.ws.rs.core.GenericType;

import org.junit.Test;

import mil.dds.anet.beans.Organization;
import mil.dds.anet.beans.Person;
import mil.dds.anet.beans.Task;
import mil.dds.anet.beans.Task.TaskStatus;
import mil.dds.anet.beans.lists.AnetBeanList;
import mil.dds.anet.beans.search.OrganizationSearchQuery;
import mil.dds.anet.beans.search.TaskSearchQuery;
import mil.dds.anet.test.TestData;
import mil.dds.anet.test.resources.utils.GraphQLResponse;

public class TaskResourceTest extends AbstractResourceTest {

	private static final String FIELDS = "id shortName longName category customFieldRef1 { id } responsibleOrg { id } status";

	@Test
	public void taskTest() { 
		final Person jack = getJackJackson();

		final Integer aId = graphQLHelper.createObject(admin, "createTask", "task", "TaskInput",
				TestData.createTask("TestF1", "Do a thing with a person", "Test-EF"), new GenericType<GraphQLResponse<Task>>() {});
		assertThat(aId).isNotNull();
		final Task a = graphQLHelper.getObjectById(admin, "task", FIELDS, aId, new GenericType<GraphQLResponse<Task>>() {});

		final Integer bId = graphQLHelper.createObject(admin, "createTask", "task", "TaskInput",
				TestData.createTask("TestM1", "Teach a person how to fish", "Test-Milestone", a, null, TaskStatus.ACTIVE), new GenericType<GraphQLResponse<Task>>() {});
		assertThat(bId).isNotNull();
		
		final Integer cId = graphQLHelper.createObject(admin, "createTask", "task", "TaskInput",
				TestData.createTask("TestM2", "Watch the person fishing", "Test-Milestone", a, null, TaskStatus.ACTIVE), new GenericType<GraphQLResponse<Task>>() {});
		assertThat(cId).isNotNull();
		
		final Integer dId = graphQLHelper.createObject(admin, "createTask", "task", "TaskInput",
				TestData.createTask("TestM3", "Have the person go fishing without you", "Test-Milestone", a, null, TaskStatus.ACTIVE), new GenericType<GraphQLResponse<Task>>() {});
		assertThat(dId).isNotNull();
		
		final Integer eId = graphQLHelper.createObject(admin, "createTask", "task", "TaskInput",
				TestData.createTask("TestF2", "Be a thing in a test case", "Test-EF", null, null, TaskStatus.ACTIVE), new GenericType<GraphQLResponse<Task>>() {});
		assertThat(eId).isNotNull();
		
		//modify a task. 
		a.setLongName("Do a thing with a person modified");
		final Integer nrUpdated = graphQLHelper.updateObject(admin, "updateTask", "task", "TaskInput", a);
		assertThat(nrUpdated).isEqualTo(1);
		final Task returned = graphQLHelper.getObjectById(jack, "task", FIELDS, aId, new GenericType<GraphQLResponse<Task>>() {});
		assertThat(returned.getLongName()).isEqualTo(a.getLongName());

		//Assign the Task to the AO
		final OrganizationSearchQuery queryOrgs = new OrganizationSearchQuery();
		queryOrgs.setText("EF8");
		final AnetBeanList<Organization> orgs = graphQLHelper.searchObjects(jack, "organizationList", "query", "OrganizationSearchQueryInput",
				"id shortName", queryOrgs, new GenericType<GraphQLResponse<AnetBeanList<Organization>>>() {});
		Organization ef8 = orgs.getList().stream().filter(o -> o.getShortName().equals("EF8")).findFirst().get();
		assertThat(ef8).isNotNull();
		
		a.setResponsibleOrg(ef8);
		final Integer nrUpdated2 = graphQLHelper.updateObject(admin, "updateTask", "task", "TaskInput", a);
		assertThat(nrUpdated2).isEqualTo(1);
		final Task returned2 = graphQLHelper.getObjectById(jack, "task", FIELDS, aId, new GenericType<GraphQLResponse<Task>>() {});
		assertThat(returned2.getResponsibleOrg().getId()).isEqualTo(ef8.getId());
		
		//Fetch the tasks off the organization
		final TaskSearchQuery queryTasks = new TaskSearchQuery();
		queryTasks.setResponsibleOrgId(ef8.getId());
		final AnetBeanList<Task> tasks = graphQLHelper.searchObjects(jack, "taskList", "query", "TaskSearchQueryInput",
				FIELDS, queryTasks, new GenericType<GraphQLResponse<AnetBeanList<Task>>>() {});
		assertThat(tasks.getList()).contains(a);
		
		//Search for the task: 
		
		//set task to inactive
		a.setStatus(TaskStatus.INACTIVE);
		final Integer nrUpdated3= graphQLHelper.updateObject(admin, "updateTask", "task", "TaskInput", a);
		assertThat(nrUpdated3).isEqualTo(1);
		final Task returned3 = graphQLHelper.getObjectById(jack, "task", FIELDS, aId, new GenericType<GraphQLResponse<Task>>() {});
		assertThat(returned3.getStatus()).isEqualTo(TaskStatus.INACTIVE);
	}
	
	@Test
	public void searchTest() { 
		Person jack = getJackJackson();
		
		TaskSearchQuery query = new TaskSearchQuery();
		query.setText("Budget");
		final AnetBeanList<Task> searchObjects = graphQLHelper.searchObjects(jack, "taskList", "query", "TaskSearchQueryInput",
				FIELDS, query, new GenericType<GraphQLResponse<AnetBeanList<Task>>>() {});
		assertThat(searchObjects).isNotNull();
		assertThat(searchObjects.getList()).isNotEmpty();
		final List<Task> searchResults = searchObjects.getList();
		assertThat(searchResults).isNotEmpty();
		assertThat(searchResults.stream()
				.filter(p -> p.getLongName().toLowerCase().contains("budget"))
				.count())
			.isEqualTo(searchResults.size());
		
		//Search for a task by the organization
		final OrganizationSearchQuery queryOrgs = new OrganizationSearchQuery();
		queryOrgs.setText("EF 2");
		final AnetBeanList<Organization> orgs = graphQLHelper.searchObjects(jack, "organizationList", "query", "OrganizationSearchQueryInput",
				"id shortName", queryOrgs, new GenericType<GraphQLResponse<AnetBeanList<Organization>>>() {});
		Organization ef2 = orgs.getList().stream().filter(o -> o.getShortName().equals("EF 2")).findFirst().get();
		assertThat(ef2).isNotNull();
		
		query.setText(null);
		query.setResponsibleOrgId(ef2.getId());
		final AnetBeanList<Task> searchObjects2 = graphQLHelper.searchObjects(jack, "taskList", "query", "TaskSearchQueryInput",
				FIELDS, query, new GenericType<GraphQLResponse<AnetBeanList<Task>>>() {});
		assertThat(searchObjects2).isNotNull();
		assertThat(searchObjects2.getList()).isNotEmpty();
		final List<Task> searchResults2 = searchObjects2.getList();
		assertThat(searchResults2).isNotEmpty();
		assertThat(searchResults2.stream()
				.filter(p -> p.getResponsibleOrg().getId().equals(ef2.getId()))
				.count())
			.isEqualTo(searchResults2.size());
		
		//Search by category
		query.setResponsibleOrgId(null);
		query.setText("expenses");
		query.setCategory("Milestone");
		final AnetBeanList<Task> searchObjects3 = graphQLHelper.searchObjects(jack, "taskList", "query", "TaskSearchQueryInput",
				FIELDS, query, new GenericType<GraphQLResponse<AnetBeanList<Task>>>() {});
		assertThat(searchObjects3).isNotNull();
		assertThat(searchObjects3.getList()).isNotEmpty();
		final List<Task> searchResults3 = searchObjects3.getList();
		assertThat(searchResults3).isNotEmpty();
		
		//Autocomplete
		query = new TaskSearchQuery();
		query.setText("1.1*");
		final AnetBeanList<Task> searchObjects4 = graphQLHelper.searchObjects(jack, "taskList", "query", "TaskSearchQueryInput",
				FIELDS, query, new GenericType<GraphQLResponse<AnetBeanList<Task>>>() {});
		assertThat(searchObjects4).isNotNull();
		assertThat(searchObjects4.getList()).isNotEmpty();
		final List<Task> searchResults4 = searchObjects4.getList();
		assertThat(searchResults4.stream().filter(p -> p.getShortName().equals("1.1")).count()).isEqualTo(1);
		assertThat(searchResults4.stream().filter(p -> p.getShortName().equals("1.1.A")).count()).isEqualTo(1);
		assertThat(searchResults4.stream().filter(p -> p.getShortName().equals("1.1.B")).count()).isEqualTo(1);
		
		query.setText("1.1.A*");
		final AnetBeanList<Task> searchObjects5 = graphQLHelper.searchObjects(jack, "taskList", "query", "TaskSearchQueryInput",
				FIELDS, query, new GenericType<GraphQLResponse<AnetBeanList<Task>>>() {});
		assertThat(searchObjects5).isNotNull();
		assertThat(searchObjects5.getList()).isNotEmpty();
		final List<Task> searchResults5 = searchObjects5.getList();
		assertThat(searchResults5.stream().filter(p -> p.getShortName().equals("1.1.A")).count()).isEqualTo(1);
	}
	
	@Test
	public void getAllTasksTest() { 
		final Person jack = getJackJackson();
		final AnetBeanList<Task> taskList = graphQLHelper.getAllObjects(jack, "tasks",
				FIELDS, new GenericType<GraphQLResponse<AnetBeanList<Task>>>() {});
		assertThat(taskList).isNotNull();
		assertThat(taskList.getList()).isNotEmpty();
	}
}
