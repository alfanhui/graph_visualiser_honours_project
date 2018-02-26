import moment from 'moment';
import {wrapContextTextToArray, wrapNonContextTextToArray} from 'utilities/WrapText';

export default class Node{
    //constructor for extended nodes
    constructor(menu, nodeData, isContext){
        let nodeID = menu.uuid.slice(0,6);
        let timestamp = moment().format("YYYY-MM-DD HH:MM:SS");
        let date = moment(timestamp, "YYYY-MM-DD HH:MM:SS").format("DD/MM/YYYY");
        let time = moment(timestamp, "YYYY-MM-DD HH:MM:SS").format("HH:MM:SS");

        //type of extended node
        let type = nodeData.type;
        let text;
        if(!Array.isArray(nodeData.text)){ //if its an array already: give up
            if(isContext){
                text = wrapContextTextToArray(nodeData.text);
            }else{
                text = wrapNonContextTextToArray(nodeData.text);
            }
        }
    
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
