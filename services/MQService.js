var amqp = require('amqplib/callback_api');
const {
  RABBITMQ_USER,
  RABBITMQ_PASS,
  RABBITMQ_HOST,
  RABBITMQ_CHANNEL
} = process.env;

const CONN_URL = `amqp://${RABBITMQ_USER}:${RABBITMQ_PASS}@${RABBITMQ_HOST}`;

let ch = null;
amqp.connect(CONN_URL, function (err, conn) {
  if (err) {
    throw err;
  }
  conn.createChannel(function (err, channel) {
    if (err) {
      throw err;
    }
    channel.assertQueue(RABBITMQ_CHANNEL, {
      durable: false
    });
    ch = channel;
  });
});

exports.publishToQueue = async (queueName, data) => {
  ch.sendToQueue(queueName, new Buffer.from(data), { persistent: true });
}

exports.receiveMessage = (queueName) => {
  ch.consume(queueName, function (msg) {
    //setTimeout(function () {
    console.log("Message:", msg.content.toString());
    //ch.ack(msg);
    //}, 8000);
  }, {
    noAck: true
  });
}

process.on('exit', (code) => {
  ch.close();
  console.log(`Closing rabbitmq channel`);
});