import moment from 'moment';
import {wrapContextTextToArray} from 'utilities/WrapText';

export default class Node_Content{
    //constructor for extended nodes
    constructor(source, newNode){
        let nodeID = source.uuid;
        let timestamp = moment().format("YYYY-MM-DD HH:MM:SS");
        let date = moment(timestamp, "YYYY-MM-DD HH:MM:SS").format("DD/MM/YYYY");
        let time = moment(timestamp, "YYYY-MM-DD HH:MM:SS").format("HH:MM:SS");
        
        console.log(newNode);

        //type of extended node
        let type = newNode.type.type;
        let text = wrapContextTextToArray(newNode.text);
        
        let layer = 0;
        let x = source.x;
        let y = source.y; 
        
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
