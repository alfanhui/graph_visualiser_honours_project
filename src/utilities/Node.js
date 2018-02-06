import moment from 'moment';

let node = {
    layer:0,
    nodeID:"",
    text:[""],
    time:"",
    date:"",
    timestamp: "YYYY-MM-DD HH:MM:SS",
    type:"",
    x: 0,
    y: 0,
}

export class Node{
    //constructor for extended nodes

    constructor(source, style, [rectX, rectY]){
        let timestamp = moment().format("YYYY-MM-DD HH:MM:SS");
        let date = moment(timestamp, "YYYY-MM-DD HH:MM:SS").format("DD/MM/YYYY");
        let time = moment(timestamp, "YYYY-MM-DD HH:MM:SS").format("HH:MM:SS");

        //type of extended node
        let type = style.type;
        let text = style.text;
        
        //details from source node
        let layer = source.layer + 1;
        let x = source.x + rectX;
        let y = source.y + ((source.text.length + 2) * rectY); //Plus 2 to give it a bit of space

        node = {
            timestamp,
            date, 
            time,
            type, 
            text,
            x, 
            y
        };
    }
}