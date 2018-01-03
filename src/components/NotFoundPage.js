import React from 'react';
import { Link } from 'react-router-dom'; //this solves everything (react warning comments removed with dom'ing this.)
import { connect } from "react-redux";
import Paper from 'material-ui/Paper';

@connect((store) => {
  return {
    state: store.generalReducer
  };
})

class NotFoundPage extends React.Component{

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render(){
    return (
      <Paper className={"paper"} id={"paper"} ref={"paper"}>
        <h4>
          404 Page Not Found
        </h4>
        <Link to="/"> Go back to homepage </Link>
      </Paper>
    );
  }
}

export default NotFoundPage;
