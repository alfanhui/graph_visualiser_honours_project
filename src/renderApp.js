import React from 'react';
import {render} from 'react-dom';
import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';
import Root from './components/Root';
import {BrowserRouter} from 'react-router-dom';
import reducer from './reducers/index';
require('./favicon.ico');
import './styles/styles.scss'; //You can import SASS/CSS files too! Webpack will run the associated loader and plug this into the page.
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const store = createStore(
  reducer,
  compose(applyMiddleware(thunk))
);



const App = (props) => (
    <div className="app">
      {/*<Header/>*/}
      <MuiThemeProvider>
            <Root {...props} />
      </MuiThemeProvider>
      {/*<Footer/>*/}
    </div>
);

render(
      <Provider store={store}>
        <BrowserRouter>
          <App/>
        </BrowserRouter>
      </Provider>
    , document.getElementById('root')
);

export default App;
