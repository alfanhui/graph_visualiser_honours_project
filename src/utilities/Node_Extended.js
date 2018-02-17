import moment from 'moment';

export default class Node_Extended{
    constructor(source, newNode, [rectX, rectY]){
        let nodeID = source.uuid;
        let timestamp = moment().format("YYYY-MM-DD HH:MM:SS");
        let date = moment(timestamp, "YYYY-MM-DD HH:MM:SS").format("DD/MM/YYYY");
        let time = moment(timestamp, "YYYY-MM-DD HH:MM:SS").format("HH:MM:SS");
        
        //type of extended node
        let type = newNode.type.type;
        let text = newNode.text.text;
        
        //details from source node
        let layer = source.layer + 1;
        let x = source.x + rectX;
        let y = source.y + ((source.text.length + 2) * rectY); //Plus 2 to give it a bit of space
        
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
