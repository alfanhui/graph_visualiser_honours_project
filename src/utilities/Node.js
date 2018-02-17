import moment from 'moment';
import wrapContextTextToArray from 'utilities/WrapText';

export class Node{
    //constructor for extended nodes
    constructor(source, newNode, [rectX, rectY]){
        let timestamp = moment().format("YYYY-MM-DD HH:MM:SS");
        let date = moment(timestamp, "YYYY-MM-DD HH:MM:SS").format("DD/MM/YYYY");
        let time = moment(timestamp, "YYYY-MM-DD HH:MM:SS").format("HH:MM:SS");

        //type of extended node
        let type = newNode.type;
        let text = this.wrapContextTextToArray(newNode.text);
        
        //details from source node
        let layer = source.layer + 1;
        let x = source.x + rectX;
        let y = source.y + ((source.text.length + 2) * rectY); //Plus 2 to give it a bit of space
        
        //Assign
        this.timestamp = timestamp;
        this.date = date; 
        this.time = time;
        this.type = type; 
        this.text = text;
        this.x = x;
        this.y = y;
    }
}