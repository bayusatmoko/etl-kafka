const express = require('express');
const { KafkaClient, Consumer, Producer, ConsumerGroup } = require('kafka-node');
const axios = require('axios');

const app = express();
const port = 3000;
const kafkaHost = process.env.KAFKA_HOST || 'localhost:9092';
const sourceTopic = process.env.KAFKA_SOURCE_TOPIC || 'source-topic';
const responseTopic = process.env.KAFKA_DESTINATION_TOPIC || 'response-topic';
const kafkaClient = new KafkaClient({ kafkaHost });
const producer = new Producer(kafkaClient);

producer.on('ready', () => {
  console.log('Kafka producer is ready');
});

producer.on('error', (err) => {
  console.error('Kafka producer error:', err);
});

const consumerGroupOptions = {
    kafkaHost,
    groupId: 'connector-consumer-group',
    autoCommit: true,
    autoCommitIntervalMs: 5000,
    sessionTimeout: 15000,
  };
const consumerGroup = new ConsumerGroup(consumerGroupOptions, sourceTopic);

consumerGroup.on('message', async (message) => {
  try {
    console.log('Received message:', message.value);

    const apiResponse = await axios.post('https://private-04683a-myxl1.apiary-mock.com/encrypt', {
      data: message.value
    });

    const responsePayload = { data: apiResponse.data, id: message.value.id };
    const payloads = [{ topic: responseTopic, messages: JSON.stringify(responsePayload) }];

    producer.send(payloads, (err, data) => {
      if (err) {
        console.error('Error producing response to Kafka', err);
      } else {
        console.log('Produced response to Kafka:', data);
      }
    });

  } catch (error) {
    console.error('Error processing message:', error);
  }
});

consumerGroup.on('error', (err) => {
  console.error('Kafka consumer error:', err);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});