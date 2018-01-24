import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import HomePage from './HomePage';
import NotFoundPage from './NotFoundPage';

const Root = (props) => (
    <Switch>
        <Route exact path="/" render={() => (<HomePage {...props}/>)}/>
        <Route path="/404" render={() => (<NotFoundPage {...props}/>)}/>
        <Redirect from="*" to="/404"/>
    </Switch>
);


export default Root;
