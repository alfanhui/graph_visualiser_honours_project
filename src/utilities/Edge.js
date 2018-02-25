import getUuid from 'uuid/v1';

export function makeEdge(source, target){   
    let edgeID = getUuid().slice(0,6);
    return ({
        edgeID,
        formEdgeID:"null",
        fromID:source.nodeID,
        source:source.nodeID,
        fromType:source.type,
        toID:target.nodeID,
        target:target.nodeID,
        toType:target.type
    });
}
