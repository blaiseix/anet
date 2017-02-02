#ANET2 Documentation


## Maintainer Documentation

### Overview
ANET2 is comprised of three major components: the Database, an Application server, and the User Interface.

- **DB**: ANET2 uses a Microsoft SQLServer database to store all data, keep backups, provide consistency of relationships, and perform advanced search.  ANET2 requires SQLServer 2014 or higher.  More details on the Schema of the Database is available in the Developer Documentation. 
- **Application Server**: ANET2's primary server functions, business logic, and authorization is performed in a Web Application server written in Java.  This server receives requests from users, determines if they are authorized and valid, and then performs the necessary fetching or manipulation of data in the Database.  The application server runs over HTTP/HTTPS (port 80/443) and communicates with clients using standard JSON data formats.  More detail about the APIs exposed from the application server is avaiable in the Developer Documentation. The application server requires Java version 1.8 to run. 

- **User Interface**: ANET2's user interface is a website that users will access using any modern web browser (Recommended: Google Chrome version XXX or greater, Required: IE version 11 or greater, Firefox version XXX or greater).  There is no client software or special browser plugins that need to be installed to access and use the ANET2 platform.

#### Software, Licenses, Skillsets/Roles
ANET2 is built primarily using Open Source languages, frameworks, and libraries that are standard throughout the software industry.  The only proprietary software that ANET2 depends on is Microsoft SQLServer.  To successfully develop, build, run, and manage a deployment of ANET2, the following roles and skillsets are recommended: 

1. **DBA**: Somebody needs to take care of your database, this role should be shared with other projects and does not need to dedicated to ANET2. Responsiblities include patching and upgrading the Database software, ensuring backups are taken and reliable, and advising on query performance/tuning. 
2. **Full-stack Software Engineer**: This person/people will be the primary developer of new features on ANET2 and troubleshoot any bugs/issues that arise. This person should have a strong background in developing user-centric applications in an agile-development lifecycle and can react quickly to changing requirements.  As the lead developer, this individual will work closely with users to understand needs and issues. This person will also work closely with the ANET2 Administrator and the Product Owner to determine the correct solution, then implement, test, and iterate on that solution.  They should have a strong understanding, or willingness to learn, the following concepts/languages: 
	* SQL
	* Java
	* REST APIs 
	* HTTP servers 
	* Javascript, HTML, CSS
	* React
	* Git

3. **System Administrator**: Somebody needs to manage your Windows server, patches, and keep the service running.  This role should be shared with other projects and does not need to be dedicated to ANET2.  Responsiblities include patching and upgrade of the Server Operating Systems, providing support to release new versions of the ANET2 platform on a regular basis, and ensuring performance and uptime of the server environment. 
4. **ANET2 Administrator / Level-1 Support**: This role provides the day-to-day management of the system, working with users on any issues, serving as the initial triage of incoming requests, performing management of top level data structures within the system (Organizations, Poams).  This person should have a basic understanding of, or willingness to learn, Databases, application servers, and websites. This role does not need to be overly technical in nature and should be focused on engaging with and supporting users of the platform. 


## Network Architecture
![Network Architecture](ANET_Network_Diagram.png)

- **Client**: The client can be any users on the appropiate network with a modern web-browser. ANET uses HTTP/HTTPS (ports 80/443) to communicate between the client and server.

- **Application Server**: The ANET2 Application Server can run on any Windows Server operating system.  Recommended system configuration is: 300 GB HDD, 64 GB RAM, and 8x CPUs.  The Application server must be able to communicate with the Database server, the Windows Domain Controller for AD Authentication, and the SMTP server for outbound mail. 

- **Database**: ANET2 Requires at least a Microsoft SQL Server 2014 Database. 

- **Backup**: Backups should be taken daily from the SQL Database and transferred to a seperate file server for safe keeping. Database backups can be taken through any means that capture the full state of the database.  The `anet.yml` configuration file and audit logs should be backed up from the Web-Application Server.

- **Authentication**: User Authentication in production is done via Windows Domain Authentication.

- **Map Imagery Server**: To enable the ANET2 maps, you will need a source of Map imagery.  ANET2 supports local cached tiles, WMS servers, or ArcGIS servers with a REST API enabled. 

- **Production vs Test Environments**: It is recommended to have a seperate Production and Test environment that mirror each other as closely as possible. However, it is totally acceptable to have less resources for the Test environment.

## Installation instructions
The following instructions document how to take a build of ANET2 and install it into a clean environment.  Instructions on how to build ANET2 are included in the Developer Documentation below. 

The following information will be needed in order to complete this installation
- Directory on the Application server to install ANET2 to. 
- Username/password and Database Name for the SQL database. 
- SMTP Server information (including Username/Password if required)
- Admin privelages to register a new Windows Service
- Information on External Map imagery sources, or local cached imagery tiles. 

### Application Server
- Unzip anet.zip into the installation directory
- Ensure JAVA\_HOME is set
- Update/create anet.yml with the right config params. 
- If you are using a local imagery cache, update the CLASSPATH in the anet.bat file to include the path to the imagery [THIS SHOULD BE CHANGED TO SUCK LESS]

### SQL
- To initiate the SQL database with the appropiate schema, run the command `bin\anet.bat db migrate anet.yml`. 
- Initialize the database by running `bin\anet.bag init anet.yml`.  This script will ask you a series of questions to seed you database with a default administrator account.

### NSSM
- We recommend the use of the NSSM tool to register ANET2 as a service within Windows.
- To do this [FILL IN THESE STEPS]

### Startup
- To start the ANET2 server for quick testing, you can run `bin\anet.bat server anet.yml`.
- To start the ANET2 server for production use, use the NSSM tool to start the ANET2 service. The command for this is `nssm.exe start anet`

## Troubleshooting
The recommended strategy for troubleshooting is to first identify where the error is occuring, either in the javascript in the browser, or an error on the application server.  Start by opening the browser developer console and look at the network calls to look for any calls that are returning errors.  If there are any errors on the network calls, look to the server side log files for more information.  If no errors are being returned, look for any errors in the browser console for more information.

In the event there are still no errors, it might be necessary to troubleshoot the issue in a development environment that supports debugging breakpoints and variable watches.  More information about how to setup and configure this environment can be found in the Developer Documentation below. 

### Log Files
For any issues related to the Application Server, check the log file in `logs\anet.log`
[INCLUDE SOME DETAILS ON HOW TO READ THE ERROR LOGS]
### Browser Console
For any issues related to the web-browser front-end check the browser console (found in the Developer Tools) in the browser. 

# Developer Documetation
Documentation for Developers is kept in README.md in the github repository. 

# DB (Schema)
![Database Diagram](ANET_Database.png)
<!-- describe all of the relationships -->


### Advanced Search
## React
### Pages, Components, API (oh my?)
### Webpack & the build


# Administration Documentation
## The Object Model
## How To's
## ANET Configuration 
ANET is configured primarily through the `anet.yml` file.  This file follows the Dropwizard configuration format ( http://www.dropwizard.io/1.0.6/docs/manual/core.html#configuration ).  Here is a description of the configuration options custom to ANET: 

- **developmentMode**: This flag controls several options on the server that are helpful when developing
	- Authentication: When development mode is `true`, ANET will use basic Authentication checking only that the username provided is equal to the `domainUsername` column of a valid user in the database.  In the event that there is not a matching user, but the provided password is equal to the username, ANET will simulate the first-time log in of a new user (ie a user who passes windows authentication but has never logged into ANET before). 
		- ex: To Log in as `Jack Jackson` from the development data set, just type in a username of `jack` when prompted. 
		- ex: To simulate a new user type in the same name for both the username and password when prompted (ie un: `hunter`, pw: `hunter` will create a new user with Domain Username of `hunter`). 
	- GraphQL: When development mode is `true`, ANET will re-compute the GraphQL graph on every API call, this allows you to rapidly develop on changes without restarting the server. 
- **smtp**: This section controls the configuration for how ANET sends emails. 
	- **hostname**: The Fully Qualified Domain Name of your SMTP Server
	- **port**: The port to connect to your SMTP server on (default: 25)
	- **username**: If your SMTP server requires authentication, provide the username here. Otherwise leave blank.
	- **password**: Your password to your SMTP server. 
	- **startTLS**: Set to true if your SMTP server requires or provides TLS (Transport Level Security) encryption.
- **emailFromAddr**: This is the email address that emails from ANET will be sent from.
- **serverUrl**: The URL for the ANET server, ie: `"https://anet.dds.mil"`.
- **database**: The configuration for your database. ANET supports either sqlite for development, or Microsoft SQL Server for production.  Follow the instructions here: http://www.dropwizard.io/1.0.6/docs/manual/jdbi.html for avaiable configuration options for the database connection.
- **waffleConfig**: ANET uses the open source `waffle` library to perform Windows Authentication ( https://github.com/Waffle/waffle ).   See https://github.com/Waffle/waffle/blob/master/Docs/ServletSingleSignOnSecurityFilter.md for documentation on the available configuration options. 