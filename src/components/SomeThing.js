import React from 'react';
import PropTypes from 'prop-types';

const SomeThing = (props) => (
  <div>
    {console.log("SomeThing", props)}
    Thing {props.thingId} is currently: {props.thing}
  </div>
);
/*
SomeThing.propTypes = {
  thingId: PropTypes.string.isRequired,
  thing: PropTypes.string.isRequired
};
*/

export default SomeThing;
