import React from 'react';
import { connect } from "react-redux";
import Paper from 'material-ui/Paper';
import DatabaseOptions from './DatabaseOptions';
import * as d3 from 'd3';

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
      ctx: undefined,
    };
  }

  componentWillMount() {

  }

  componentDidMount(){
    let $ctx = this.refs.canvas.getContext('2d')
    $ctx.canvas.width  = (window.innerWidth * .99);
    $ctx.canvas.height = (window.innerHeight - 20);
    this.setState({ctx: $ctx});

    let canvas = document.querySelector("canvas");
    let context = canvas.getContext("2d");
    let width = canvas.width;
    let height = canvas.height;

    let simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) {console.log("link", d);  return d.id; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter());

    d3.json("data/1010.json", function(error, graph) {
      if (error) throw error;

      simulation.nodes(graph.nodes).on("tick", ticked);

      simulation.force("link").links(graph.links);

      function ticked() {
        context.clearRect(0, 0, width, height);
        context.save();
        context.translate(width / 2, height / 2 + 40);

        context.beginPath();
        graph.links.forEach(function(d){
          console.log("edge" , d);
          context.moveTo(d.source.x, d.source.y);
          context.lineTo(d.target.x, d.target.y);
        });
        context.strokeStyle = "#aaa";
        context.stroke();

        context.beginPath();
        graph.nodes.forEach(function(d){
          console.log("node" , d);
          context.moveTo(d.x + 3, d.x);
          context.arc(d.x, d.y, 3, 0, 2 * Math.PI);
        });
        context.fill();
        context.strokeStyle = "#fff";
        context.stroke();
        context.restore();
      }
    });
  }

  componentDidUpdate() {

  }

  componentWillUnmount(){

  }

  render(){
    console.log("PROPS: " , JSON.parse(JSON.stringify(this.props)));
    return (
      <Paper id={"paper"}>
      <canvas
        className="canvas"
        ref="canvas"
        onTouchStart={(event)=>this.touchStart(event)}
        onTouchMove={(event)=>this.touchMove(event)}
        onTouchEnd={(event)=>this.touchEnd(event)}
        onTouchCancel={(event)=>this.touchCancel(event)}>
      This Browser does not support html canvas.
      </canvas>
      {/*<DatabaseOptions/>*/}
      </Paper>
    );
  }
}

export default HomePage;
