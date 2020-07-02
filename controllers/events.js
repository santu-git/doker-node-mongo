const mqService = require("../services/MQService");
const path = require("path");
const Event = require("../models/event");

const eventsToPublish = [
  "meeting-created",
  "meeting-ended",
  "user-joined",
  "user-left",
  "rap-post-publish-ended",
];
const { RABBITMQ_CHANNEL } = process.env;

mqService.receiveMessage(RABBITMQ_CHANNEL);
exports.create = function (req, res) {
  //var newEvent = new Event(req.body);
  //console.log(req.body.event);
  //console.log(JSON.parse(req.body.event)[0].data);
  let eventObj = JSON.parse(req.body.event)[0].data;
  eventObj["domain"] = req.body.domain;
  eventObj["ts"] = new Date(eventObj.event.ts).toISOString();
  var newEvent = new Event(eventObj);
  newEvent.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      publishEvent(eventObj);
    }
  });
  res.status(204).send();
};

function publishEvent(eventObj) {
  if (eventsToPublish.includes(eventObj.id)) {
    mqService.publishToQueue(RABBITMQ_CHANNEL, JSON.stringify(eventObj));
  }
}
exports.list = function (req, res) {
  Shark.find({}).exec(function (err, sharks) {
    if (err) {
      return res.send(500, err);
    }
    res.render("getshark", {
      sharks: sharks,
    });
  });
};
