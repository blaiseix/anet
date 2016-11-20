<#import "../application/layout.ftl" as application>
<@application.layout>
<h1>Listing People</h1>
<table>
<tr><th>id</th><th>Name</th><th>email</th><th>Status</th><th>Rank</th><th>Role</th></tr>
<#list list as p>
	<tr>
	<td><a href="/people/${p.id}">${p.id}</a></td>
	<td>${p.name}</td>
	<td>${p.emailAddress!}</td>
	<td>${p.status!}</td>
	<td>${p.rank!}</td>
	<td>${p.role}</td>
	<td><a href="/people/${p.id}/edit">[Edit]</a></td>
</#list>
</table>
<a href="/people/new">[Create new Person]</a>
</@application.layout>
