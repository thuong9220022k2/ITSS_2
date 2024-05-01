const { MongoClient } = require('mongodb');

const connectToMongo = async () => {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect().then(() => {
        console.log('Connected to MongoDB')
    });
    return client;
};

exports.connectToMongo = connectToMongo;

