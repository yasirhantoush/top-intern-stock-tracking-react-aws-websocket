const AWS = require('aws-sdk')

const ENDPOINT = 'https://vdrkr3ciw8.execute-api.us-east-2.amazonaws.com/production';
const client = new AWS.ApiGatewayManagementApi({ endpoint: ENDPOINT});

const sendToOne = async (id, body) => {
    try {
        await client.postToConnection({
            ConnectionId: id,
            Data: Buffer.from(JSON.stringify(body))
        }).promise();
    } catch (err) {
        console.log(err);
    }
};

const sendToAll = async (ids, body) => {
    try {
        const all = ids.map((id) => sendToOne(id, body));
        return Promise.all(all);
    } catch (err) {
        console.log(err);
    }
};

const connections = {};
const stats = {
    stock: 5
};

exports.handler = async (event) => {

    if (event.requestContext) {
        console.log(event);
    
        const routeKey = event.requestContext.routeKey;
        const connectionId = event.requestContext.connectionId;
        
        let body = {};
        try {
            if(event.body) {
                body = JSON.parse(event.body);
            }
        } catch (err) {
            
        }
        
        switch (routeKey) {
            case '$connect':
                console.log('********** connection occured', connectionId);
                connections[connectionId] = 'connected';
                break;
            case '$disconnect':
                console.log('********** disconnection occured', connectionId);
                delete connections[connectionId];
                break;
            case '$default':
                console.log('********** $default occured', connectionId, routeKey);
                break;
            case 'stockIn':
                console.log('********** stockIn occured', connectionId);
                stats.stock += Number(body.qty||0);
                await sendToAll(Object.keys(connections), stats);
                break;
            case 'stockOut':
                console.log('********** stockOut occured', connectionId);
                stats.stock -= Number(body.qty||0);
                await sendToAll(Object.keys(connections), stats);
                break;
            default:
                console.log('********** unknown route hit', routeKey);
                break;
        }
        
        const response = {
            statusCode: 200,
            body: JSON.stringify('Hello from Lambda!'),
        };
        return response;
    }
    
};
