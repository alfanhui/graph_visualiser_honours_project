import getUuid from 'uuid/v1';

export function makeEdge(source, target){   
    let edgeID = getUuid().slice(0,6);
    return ({
        edgeID,
        formEdgeID:"null",
        source:source.nodeID,
        fromType:source.type,
        target:target.nodeID,
        toType:target.type
    });
}
