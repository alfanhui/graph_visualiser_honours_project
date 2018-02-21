import React from 'react';
import {Link} from 'react-router';
import {Footer} from 'react-materialize';
import PropTypes from 'prop-types';


class RT_Footer extends React.Component{
  static propTypes = {
    children: PropTypes.node.isRequired
  };

  render(){
    return (
    <div>
    {this.props.children}
      <Footer copyrights="&copy; 2018 Copyright"
      moreLinks={
        <Link className="grey-text text-lighten-4 right" href="#!">More Links</Link>
      }
      links={
        <ul>
          <li><Link to="/about" className="grey-text text-lighten-3">About Us</Link></li>
        </ul>
      }
      className="example"
      >
        <h5 className="white-text">Footer Content</h5>
        <p className="grey-text text-lighten-4"></p>
      </Footer>

    </div>
);
 }
}
export default RT_Footer;
