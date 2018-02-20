import moment from 'moment';
import {wrapNonContextTextToArray} from 'utilities/WrapText';

export default class Node_Extended{
    constructor(menu, nodeData, sourceNode){
        let nodeID = menu.uuid.slice(0,6);
        let timestamp = moment().format("YYYY-MM-DD HH:MM:SS");
        let date = moment(timestamp, "YYYY-MM-DD HH:MM:SS").format("DD/MM/YYYY");
        let time = moment(timestamp, "YYYY-MM-DD HH:MM:SS").format("HH:MM:SS");
        
        //type of extended node
        let type = nodeData.type;
        let text = wrapNonContextTextToArray(nodeData.text);
        
        //details from source node
        let layer = sourceNode.layer + 1;
        let x = menu.x + 50;
        let y = menu.y + 50;
        
        //Assign
        this.nodeID = nodeID;
        this.timestamp = timestamp;
        this.layer = layer;
        this.date = date; 
        this.time = time;
        this.type = type; 
        this.text = text;
        this.x = x;
        this.y = y;
    }
}
