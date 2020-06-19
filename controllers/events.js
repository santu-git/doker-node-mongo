const mqService = require('../services/MQService');
const path = require('path');
const Event = require('../models/event');

const { 
  RABBITMQ_CHANNEL
} = process.env;
exports.create = function (req, res) {
  //var newEvent = new Event(req.body);
  //console.log(req.body.event);
  //console.log(JSON.parse(req.body.event)[0].data);
  let eventObj = JSON.parse(req.body.event)[0].data;
  eventObj['domain']= req.body.domain;
  eventObj['timestamp']= eventObj.event.ts;
  var newEvent = new Event(eventObj);
  newEvent.save(function (err) {
    if (err) {
      console.log(err);
    }else{
      mqService.publishToQueue(RABBITMQ_CHANNEL,JSON.stringify(eventObj));
      mqService.receiveMessage(RABBITMQ_CHANNEL);
    } 
  })
  res.status(204).send();
};

exports.list = function (req, res) {
  Shark.find({}).exec(function (err, sharks) {
    if (err) {
      return res.send(500, err);
    }
    res.render('getshark', {
      sharks: sharks
    });
  });
};
