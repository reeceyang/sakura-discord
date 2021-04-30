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
  if (msg.content === '?s help') {
    msg.channel.send("todo");
  }
  if (msg.content === '?s test sound') {
    const connection = client.channels.cache.find(ch => ch.name === 'study-vc').join();
    const dispatcher = connection.play('https://reeceyang.github.io/sakura-timer/mixkit-achievement-bell-600.wav');
    dispatcher.destroy();
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
    const connection = client.channels.cache.find(ch => ch.name === 'study-vc').join();
    if ((min == 5 || min == 35) && t.getSeconds() == 0 && !playedBefore) {
      studyChannel.send("break time over! work for 25 minutes now");
      const dispatcher = connection.play('https://reeceyang.github.io/sakura-timer/mixkit-phone-ring-bell-593.wav');
      playedBefore = true;
      dispatcher.destroy();
    } else if ((min == 0 || min == 30) && t.getSeconds() == 0 && !playedBefore) {
      studyChannel.send("work time over! break for 5 minutes now");
      const dispatcher = connection.play('https://reeceyang.github.io/sakura-timer/mixkit-achievement-bell-600.wav');
      playedBefore = true;
      dispatcher.destroy();
    } else if (playedBefore) {
      playedBefore = false;
    }

  }, 500);
