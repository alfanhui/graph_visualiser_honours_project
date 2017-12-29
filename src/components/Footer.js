import React from 'react';
import {Link} from 'react-router';
import {Footer} from 'react-materialize';


class RT_Footer extends React.Component{
  render(){
    return (
    <div>
    {this.props.children}
      <Footer copyrights="&copy; 2017 Copyright"
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
        <p className="grey-text text-lighten-4">You can use rows and columns here to organize your footer content.</p>
      </Footer>

    </div>
);
 }
}
export default RT_Footer;
