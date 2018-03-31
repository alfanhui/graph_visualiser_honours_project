<p align="center"><img src="https://github.com/alfanhui/graph_visualiser_honours_project/blob/master/docs/logoREADME.png?raw=true"/></p>


# Graph Visualiser

Graph visualiser is my honours project for my Computing & Cognitive Science BSc, graduating in 2018. It is a multi-user multi-touch interactive web application, that displays Graphs created by ARG-Tech, a Argument Analysis group at the University of Dundee. It was closely inspired by OVA+(http://ova.arg-tech.org/), ARG-Tech's current graph visualisation web application.

## How To Use

You will be presented with a whitescreen with a grey border around it. 

With touch or click anywhere will bring up the main menu. 
<p align="center"><img src="https://github.com/alfanhui/graph_visualiser_honours_project/blob/master/docs/main_menu.png?raw=true"/></p>
This menu is on a timer and will disappear when inactive. At the main menu, you can `Import Database` to load data from the database to visualise. Upon every import, the nodes process through to the `Auto-Layout` function, and can be manually processed via the main menu. The `Create Node` option allows for you to create a new node. There is an input box to type on a physical keyboard, or you can change its type to create an extended node to be able to describe Argument Analysis Structure. Finally, `Options` contains three toggle switches to control different elements of the application and two export functions. For the toggle switches, `Auto-Update` checked will refresh the database if new nodes are updated to the database externally. `Update-Changes` when checked will push any CRUD actions to the database. `Paint` option gives the ability to use the whitespace as a whiteboard if needs be: note there is only 1 colour. In the last quadrant, there is a Database connection health status, this will either say OK or BAD. The last row of options are the exports, one button for PNG image exports and the other for JSON export of the current data being visualised.

<p>Here are three standard nodes, two of content and a AIF extended node joining the two information nodes together.</p>
<p align="center"><img src="https://github.com/alfanhui/graph_visualiser_honours_project/blob/master/docs/nodes.png?raw=true"/></p>

<p>You can access the element menu when you tap any node.</p>
<p align="center"><img src="https://github.com/alfanhui/graph_visualiser_honours_project/blob/master/docs/element_menu.png?raw=true"/></p>
Here you can `Create an Edge` from this node, `Edit Node` to change the node type, and `Delete Node/Edge`. When creating edges, you are presented with a menu to cycle through which node to create a menu to. The experience of creating an edge is solely located from the source node, so there is no requirement to drag or reach for the target node. <p>This is shown below:</p>
<p align="center"><img src="https://github.com/alfanhui/graph_visualiser_honours_project/blob/master/docs/Create_Edge.png?raw=true"/>

## Initial Machine Setup
Got a Mac? `brew install node git neo4j`
1. **Install [Node 5.0.0 or greater](https://nodejs.org)**.
2. **Install [Git](https://git-scm.com/downloads)**.
3. **Install [Neo4j Community Edition](https://neo4j.com/download/?ref=subscriptions)**.
4. Git Clone this project
5. Update /src/config.js with neo4j username, password, port and url (original not uploaded for security reasons)

## Starting up

1. Run `npm start` to start development in Chrome or Firefox browser. (Other browsers may work, but are not tested)
2. Run `./neo4j_start` to start neo4j
3. [http://localhost:3000](http://localhost:3000) to access website
4. [http://localhost:7475/browser](http://localhost:7475/browser) to access neo4j directly


## Running the tests

Type `npm run test:watch` to start the testing suite.

## Deployment

Deployment is best done through docker and docker-compose. Please contact me if you want the docker_setup details as they contain sensitive database information. Once you have the folder, in **docker_setup/** directory, there is a **RUN_ME.sh** and a pre-configured **docker-compose.yml** file that will take care of deployment. Make sure the **docker-compose.yml** points to the correct location of the **graph_visualiser_honours_project/** directory before running `./RUN_ME.sh`. 
Note: this will run docker versions of neo4j and node.js as a daemon process.

## Built With

* [REACT](https://reactjs.org/) - User-Interface library
* [REDUX](https://redux.js.org/) - Redux is a predictable state container
* [D3](https://d3js.org/) - Helps with positioning the nodes
* [NEO4J](https://neo4j.com/) - NoSQL Database to store data

## Authors

* **Stuart Huddy** - *full design and implementation* - 

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Many thanks to my supervisor Professor Chris Reed and ARG-Tech at the University of Dundee
