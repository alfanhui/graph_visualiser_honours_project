import React from 'react';
import { connect } from "react-redux";
import SomeThing from './SomeThing';
import SomeThingSetter from './SomeThingSetter';
import { PostQuery } from 'api/db';
import { loadJSON, graphMLtoCypher } from 'utilities/graphML';
//url path for the database


@connect((store) => {
  return {
      state: store.generalReducer
  };
})





class HomePage extends React.Component{

   
    constructor(props) {
        super(props);
        this.state = {

        };

    }
 

 
    componentWillMount() {
        console.log("Wiping  database..");
        PostQuery(['MATCH (n) OPTIONAL MATCH (n) - [r] - () DELETE n, r'], null, "Wiping Database");
        console.log("Testing JSON import..");
        loadJSON(function (response) {
            // Parse JSON string into object
            let actual_JSON = JSON.parse(response);
            console.log(actual_JSON);
            graphMLtoCypher(actual_JSON);
        });
        
    }




    componentDidUpdate() {

    }

    componentWillUnmount(){

    }

 


    render(){
      return (
        <div className={"main"}>
          <div className={'h2'}> REACT </div>
          <SomeThing thingId="0" thing={this.props.state.thing0}/>
          <SomeThingSetter thingId="0" />

          <SomeThing thingId="1" thing={this.props.state.thing1}/>
          <SomeThingSetter thingId="1" />

          <SomeThing thingId="2" thing={this.props.state.thing2}/>
          <SomeThingSetter thingId="2" />
        </div>
      );
    }

}

export default HomePage;
