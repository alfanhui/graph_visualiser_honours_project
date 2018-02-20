import getUuid from 'uuid/v1';

export function makeEdges(source, middle, target){   
    let edgeID_1 = getUuid().slice(0,6),
    edgeID_2 = getUuid().slice(0,6);
    return ([{
        edgeID: edgeID_1,
        formEdgeID:"null",
        source:source.nodeID,
        fromType:source.type,
        target:middle.nodeID,
        toType:middle.type
    },{
        edgeID: edgeID_2,
        formEdgeID:"null",
        source:middle.nodeID,
        fromType:source.type,
        target:target.nodeID,
        toType:middle.type
    }]);
}
