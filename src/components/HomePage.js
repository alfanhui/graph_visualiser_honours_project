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
    };
  }

  componentWillMount() {

  }

  componentDidMount(){
    this.setDisplaySize();

    var svg = d3.select("svg");
    let width = +svg.attr("width");
    let height = +svg.attr("height");

    const color = d3.scaleOrdinal(d3.schemeCategory20); //range the colours

    const simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width /2 , height /2 ));


    d3.json("data/1010.json", function(error, graph) {
      if (error) throw error;

      let link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(graph.links)
      .enter().insert("line")
      .attr("stroke", color(1));

      console.log(link);

      let node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(graph.nodes)
      .enter().append("circle")
      .attr("r", 5)
      .attr("fill", function(d) { return color(d.type); })
      .call(d3.drag() //mouse movement
      .on("start", function(d){
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", function(d){
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      })
      .on("end", function(d){
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }));

      node.append("title") //titles?
      .text(function(d) { return d.id; });

      simulation.nodes(graph.nodes).on("tick", ticked);

      simulation.force("link").links(graph.links);

      function ticked() {
        link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

        node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
      }
    });


  }

  componentDidUpdate() {

  }

  componentWillUnmount(){

  }

  dragstarted = (d) => {

  }

  //This sets the size and coordinate maps in relation to one another
  setDisplaySize(){
    let paper = document.getElementById('paper');
    paper.width  = (window.innerWidth);
    paper.height = (window.innerHeight);
    let svg = document.querySelector("svg");
    svg.setAttribute('width', paper.width - 40);
    svg.setAttribute('height', paper.height - 40);
  }

  render(){
    console.log("PROPS: " , JSON.parse(JSON.stringify(this.props)));
    return (
      <Paper className={"paper"} id={"paper"} ref={"paper"}>
      <svg
      className="svg"
      id="svg"
      ref="svg"
      onTouchStart={(event)=>this.touchStart(event)}
      onTouchMove={(event)=>this.touchMove(event)}
      onTouchEnd={(event)=>this.touchEnd(event)}
      onTouchCancel={(event)=>this.touchCancel(event)}>
      This Browser does not support html canvas.
      </svg>
      </Paper>
    );
  }
}

{/*<DatabaseOptions/>*/} //a button to load database

export default HomePage;
