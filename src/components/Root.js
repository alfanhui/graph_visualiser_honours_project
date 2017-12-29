import React from 'react';
import { Switch, Route } from 'react-router-dom';
import HomePage from './HomePage';
import NotFoundPage from './NotFoundPage';

const Root = (props) => (
    <Switch>
        <Route exact path="/" render={() => (<HomePage {...props}/>)}>
          <Route exact path="*" render={() => (<NotFoundPage {...props}/>)}/>
        </Route>
    </Switch>
);


export default Root;
