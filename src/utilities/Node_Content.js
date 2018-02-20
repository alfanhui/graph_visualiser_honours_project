import moment from 'moment';
import {wrapContextTextToArray} from 'utilities/WrapText';

export default class Node_Content{
    //constructor for extended nodes
    constructor(menu, nodeData){
        let nodeID = menu.uuid.slice(0,6);
        let timestamp = moment().format("YYYY-MM-DD HH:MM:SS");
        let date = moment(timestamp, "YYYY-MM-DD HH:MM:SS").format("DD/MM/YYYY");
        let time = moment(timestamp, "YYYY-MM-DD HH:MM:SS").format("HH:MM:SS");

        //type of extended node
        let type = nodeData.type;
        let text = wrapContextTextToArray(nodeData.text);
        
        let layer = 0;
        let x = menu.x; //need to move this node to a new location
        let y = menu.y; 
        
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
