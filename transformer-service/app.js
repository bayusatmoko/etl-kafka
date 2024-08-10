const express = require('express');
const { Kafka } = require('kafkajs');
const axios = require('axios');

const app = express();
const port = 3000;
const kafkaHost = process.env.KAFKA_HOST || 'localhost:9092';
const sourceTopic = process.env.KAFKA_SOURCE_TOPIC || 'source-topic';
const responseTopic = process.env.KAFKA_DESTINATION_TOPIC || 'response-topic';

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: [kafkaHost]
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'connector-consumer-group' });

const run = async () => {
  // Producing
  await producer.connect();
  console.log('Kafka producer is connected');

  // Consuming
  await consumer.connect();
  console.log('Kafka consumer is connected');
  await consumer.subscribe({ topic: sourceTopic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        console.log('Received message:', message.value.toString());

        const apiResponse = await axios.post('https://private-04683a-myxl1.apiary-mock.com/encrypt', {
          data: message.value.toString()
        });

        const responsePayload = { data: apiResponse.data, id: message.value.toString().id };
        await producer.send({
          topic: responseTopic,
          messages: [{ value: JSON.stringify(responsePayload) }]
        });

        console.log('Produced response to Kafka:', responsePayload);

      } catch (error) {
        console.error('Error processing message:', error);
      }
    },
  });
};

run().catch(console.error);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});