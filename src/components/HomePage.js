import React from 'react';
import { connect } from "react-redux";
import Paper from 'material-ui/Paper';
import DatabaseOptions from './DatabaseOptions';

@connect((store) => {
  return {
      state: store.generalReducer
  };
})

//console.log(JSON.parse(JSON.stringify(err)));

class HomePage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentWillMount() {

    }

    componentDidUpdate() {

    }

    componentWillUnmount(){

    }

    render(){
        console.log("PROPS: " , JSON.parse(JSON.stringify(this.props)));
        return (
          <Paper>
            <div className={"main"}>
              <div className={'h2'}> REACT </div>
              <DatabaseOptions/>
            </div>
          </Paper>
      );
    }

}

export default HomePage;
