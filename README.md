<p align="center"><img src="https://moduscreate.com/wp-content/uploads/2014/03/react-opti.png"/></p>


# Graph Visualiser

Graph visualiser is my honours project for my Computing & Cognitive Science BSc, graduating in 2018. It is a multi-user multi-touch interactive web application, that displays Graphs created by ARG-Tech, a Argument Analysis group at the University of Dundee. It was closely inspired by OVA+(http://ova.arg-tech.org/), ARG-Tech's current graph visualisation web application.

## How To Use



### Prerequisites

## Initial Machine Setup
1. **Install [Node 5.0.0 or greater](https://nodejs.org)**. 
2. **Install [Git](https://git-scm.com/downloads)**. 

### Installing

Type `npm install && npm start` to start development in Chrome or Firefox browser. (Other browsers may work, but are not tested)

## Running the tests

Type `npm run test:watch` to start the testing suite.

## Deployment

Deployment is best done through docker and docker-compose. In **docker_setup/** directory, there is a **RUN_ME.sh** and a pre-configured **docker-compose.yml** file that will take care of deployment. Make sure teh **docker-compose.yml** points to the correct location of the **graph_visualiser_honours_project/** directory before running `./RUN_ME.sh`. 
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
