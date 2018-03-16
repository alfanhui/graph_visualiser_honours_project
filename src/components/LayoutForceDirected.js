import React from 'react';
import { connect } from "react-redux";
import * as d3 from 'd3';
import PropTypes from 'prop-types';

let rectX = 60;
let rectY = 30;
let width = window.innerWidth - 40;
let height = window.innerHeight - 40;

const force = d3.forceSimulation()
    .force("link", d3.forceLink().id(function (d) { return d.nodeID; }).strength(0.005)) //mac 0.005 // qmb -0.2
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

const color = d3.scaleOrdinal(d3.schemeCategory20); //range the colours

@connect((store) => {
    return {
        state: store.generalReducer
    };
})

class LayoutForceDirected extends React.Component {

    static propTypes = {
        dispatch: PropTypes.func,
        state: PropTypes.object,
        onMouseDown: PropTypes.func,
        onMouseMove: PropTypes.func,
        onMouseUp: PropTypes.func,
        menuMainArray: PropTypes.func,
        menuElementArray: PropTypes.func,
    };


    constructor(props) {
        super(props);
        this.state = {

        };
        //console.log("Width: " + width + " Height: " + height + " Ratio: " + (width / height)); // eslint-disable-line
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        nextProps.state.nodes.length > 0 && force.nodes(nextProps.state.nodes);
        nextProps.state.links.length > 0 && force.force("link").links(nextProps.state.links);
        force.on('tick', () => {
            // after force calculation starts, call
            // forceUpdate on the React component on each tick
            this.forceUpdate();
        });
    }

    componentWillUnmount() {

    }

    renderNodes = (node) => {
        //boundary box by Tom Roth
        //https://bl.ocks.org/puzzler10/2531c035e8d514f125c4d15433f79d74
        //18th March 2017
        let transX = Math.max(rectX / 2, Math.min(width - rectX / 2, node.x)) - (rectX / 2),
            transY = Math.max(rectY / 2, Math.min(height - rectY / 2, node.y)) - (rectY / 2);
        let transform = "translate(" + transX + "," + transY + ")";
        return (
            <rect className="node" ref="node" id={node.nodeID} key={"node" + node.nodeID} width={rectX} height={rectY}
                fill={color(node.type)} transform={transform} onMouseDown={this.onNewMouseStart} onMouseMove={this.onNewMouseMove} onMouseUp={this.onNewMouseUp} />
        );
    }

    renderLabels = (node) => {
        let transX = Math.max(rectX / 2, Math.min(width - rectX / 2, node.x)) - (rectX / 2),
            transY = Math.max(rectY / 2, Math.min(height - rectY / 2, node.y)) - (rectY / 2);
        let transform = "translate(" + (transX + 15) + "," + (transY + 20) + ")";
        return (
            <text key={"label" + node.nodeID} transform={transform}>{node.nodeID}</text>
        );
    }

    renderLinks = (link) => {
        return (
            <line className="link" key={link.edgeID} stroke={color(1)}
                x1={link.source.x} y1={link.source.y + (rectY / 2)} x2={link.target.x} y2={link.target.y + (rectY / 2)} />
        );
    }
    //change the distance of the links/edges
    changeRange(simulation, newStrength) {
        simulation.force("link").strength(+newStrength);
        simulation.alpha(1).restart();
    }

    render() {
        return (
            <svg
                className="svg" id="svg" ref="svg"
                width={width}
                height={height}>
                <rect id="main" width={width} height={height} style={{ fill: 'white', pointerEvents: 'fill', strokeWidth: '0' }}
                    onMouseDown={(event) => this.props.onMouseDown(event)}
                    onMouseMove={(event) => this.props.onMouseMove(event)}
                    onMouseUp={(event) => this.props.onMouseUp(event)} />
                <g>
                    {this.props.state.links.length > 0 && this.props.state.links.map(this.renderLinks)}
                    {this.props.state.nodes.length > 0 && this.props.state.nodes.map(this.renderNodes)}
                    {this.props.state.nodes.length > 0 && this.props.state.nodes.map(this.renderLabels)}
                </g>
                {this.props.state.menuMainArray.length > 0 && this.props.state.menuMainArray.map((menu) => this.props.menuMainArray(menu))}
                {this.props.state.menuElementArray.length > 0 && this.props.state.menuElementArray.map((menu) => this.props.menuElementArray(menu))}
                This Browser does not support html canvas.
      </svg>
        );
    }
}

export default LayoutForceDirected;
