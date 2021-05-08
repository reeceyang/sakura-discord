const Discord = require('discord.js');
require('dotenv').config();

const client = new Discord.Client();

client.on('ready', () => {
  console.log('Bot is ready');
});

client.login(process.env.BOT_TOKEN);

var info = "";
var joinedVoiceChannel = false;
var voiceChannel;
var sendMessages = false;
const helpMessage = `sakura-timer
s - current time
s join - sakura-timer will play sounds in the voice channel you are in
s on - turn on work and break messages
s off - turn off work and break messages
source: https://github.com/reeceyang/sakura-discord
`;


client.on('message', async msg => {
  if (msg.content === 's') {
    msg.channel.send(info);
  }
  if (msg.content === 's help') {
    msg.channel.send(helpMessage);
  }
  if (msg.content === 's join') {
    // Only try to join the sender's voice channel if they are in one themselves
    if (msg.member.voice.channel) {
      voiceChannel = msg.member.voice.channel;
      msg.reply("sakura-timer will play sounds in " + voiceChannel.name + "!");
      joinedVoiceChannel = true;

    } else {
      msg.reply('you need to join a voice channel first!');
    }
  }
  if (msg.content === 's on') {
    msg.channel.send("turned sounds and messages on");
    sendMessages = true;
  }
  if (msg.content === 's off') {
    msg.channel.send("turned sounds and messages off");
    sendMessages = false;
  }
  if (msg.content === 's test sound') {
    if (joinedVoiceChannel) {
      const connection = await voiceChannel.join();
      connection.play('https://reeceyang.github.io/sakura-timer/mixkit-phone-ring-bell-593.wav');
    }
  }
  if (msg.content === 's test message') {
    const studyChannel = client.channels.cache.find(ch => ch.name === 'study-room');
    studyChannel.send("test");
  }
});

var playedBefore = false;

setInterval(async () => {
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
    // const connection = client.channels.cache.find(ch => ch.name === 'study-vc').join();
    if ((min == 5 || min == 35) && t.getSeconds() == 0 && !playedBefore) {
      if (sendMessages) studyChannel.send("break time over! work for 25 minutes now");
      if (joinedVoiceChannel) {
        const connection = await voiceChannel.join();
        connection.play('https://reeceyang.github.io/sakura-timer/mixkit-phone-ring-bell-593.wav');
      }
      playedBefore = true;
    } else if ((min == 0 || min == 30) && t.getSeconds() == 0 && !playedBefore) {
      if (sendMessages) studyChannel.send("work time over! break for 5 minutes now");
      if (joinedVoiceChannel) {
        const connection = await voiceChannel.join();
        connection.play('https://reeceyang.github.io/sakura-timer/mixkit-achievement-bell-600.wav');
      }
      playedBefore = true;
    } else if (playedBefore) {
      playedBefore = false;
    }
  }, 500);
