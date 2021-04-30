const Discord = require('discord.js');
require('dotenv').config();

const client = new Discord.Client();

client.on('ready', () => {
  console.log('Bot is ready');
});

client.login(process.env.BOT_TOKEN);

var info = "";

client.on('message', (msg) => {
  if (msg.content === '?s') {
    msg.channel.send(info);
  }
});

var playedBefore = false;

setInterval(() => {
    var t = new Date();
    var min = t.getMinutes();
    var s = ""
    var m;
    if (min >= 5 && min < 30) {
      if (t.getSeconds() == 0) {
        m = (30 - min);
      } else {
        m = (29 - min);
      }
      s += "work " + m.toString();
    } else if (min >= 35 && min < 60) {
      if (t.getSeconds() == 0) {
        m = (60 - min);
      }
      else {
        m = (59 - min);
      }
      s += "work " + m.toString();
    } else if (min >= 30) {
      if (t.getSeconds() == 0) {
        m = (35 - min);
      }
      else {
        m = (34 - min);
      }
      s += "break " + m.toString();
    } else {
      if (t.getSeconds() == 0) {
        m = (5 - min);
      }
      else {
        m = (4 - min);
      }
      s += "break " + m.toString();
    }
    s += ":" + ((60 - t.getSeconds()) % 60).toString().padStart(2, "0") + " left";
    info = s;

    const studyChannel = client.channels.cache.find(ch => ch.name === 'study-room');
    if ((min == 5 || min == 35) && t.getSeconds() == 0 && !playedBefore) {
      studyChannel.send("break time over! work for 25 minutes now");
      workStart.play();
      playedBefore = true;
    } else if ((min == 0 || min == 30) && t.getSeconds() == 0 && !playedBefore) {
      studyChannel.send("work time over! break for 5 minutes now");
      breakStart.play();
      playedBefore = true;
    } else if (playedBefore) {
      playedBefore = false;
    }
  }, 500);
