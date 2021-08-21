//don't have the DB anymore. srry ¯\_(ツ)_/¯

//ADR BOT is a discord bot I created for a small discord community.

const Discord = require('discord.js');
const bot = new Discord.Client();
var mysql = require("mysql");
var fs = require("fs");
const PREFIX = "a!"
var embedcolor = "0x3295ad"
var adrid = "714217039396470833"
var luxevent;
var voice_channel_connection = {};
// -> Mobile mode
var Constants = Discord.Constants;
Constants.DefaultOptions.ws.properties.$browser = "Discord iOS";
function GenerateDate()
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
    return `${strziua}/${strluna}/${an} ${strora}:${strminut}:${strsecunda}`
}
function secondsToHms(d) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor(d % 3600 / 60);
  var s = Math.floor(d % 3600 % 60);

  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return hDisplay + mDisplay + sDisplay; 
}
function GetAddictedName()
{
    var currentguild = bot.guilds.cache.get(adrid)
    return currentguild.name;
}
function sleeper(ms) {
    return function(x) {
      return new Promise(resolve => setTimeout(() => resolve(x), ms));
    };
  }
function UpdateUserActivity(userid, guildid, row, value) {
  con.query(`UPDATE users_activity SET ${row} = '${value}' WHERE user_id = '${userid}' AND guild_id = '${guildid}'`);
}
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "adrbot"
});
con.connect(err => 
    {
        if(err) 
        {
            console.log("Database connection failed!")
        }
        else 
        {
            console.log(`Database connection successfully!`);
        }
    });
//=============================================================================================
bot.on("voiceStateUpdate", (oldMember, newMember) => { 
  var new_channel = newMember.member.voice.channel;
  if(new_channel != undefined) {
      if(voice_channel_connection[newMember.member.user.id+newMember.member.guild.id] != 1) {
          voice_channel_connection[newMember.member.user.id+newMember.member.guild.id] = 1;
          con.query(`SELECT * FROM users_activity WHERE user_id = '${newMember.member.user.id}' AND guild_id = '${newMember.member.guild.id}'`, function(err, result) {
              if(result != 0) {
                  var total_voice_connections = result[0].total_voice_connections;
                  UpdateUserActivity(newMember.member.user.id, newMember.member.guild.id, "total_voice_connections", total_voice_connections + 1);
              }
              else {
                  if(!newMember.member.user.bot) {
                      con.query(`INSERT INTO users_activity (user_id, guild_id) VALUES ('${newMember.member.user.id}', '${newMember.member.guild.id}')`);
                      UpdateUserActivity(newMember.member.user.id, newMember.member.guild.id, "total_voice_connections", 1);
                  }
              }
          });
      }
  }
});
//=============================================================================================
bot.on('ready', () => {
    var currentguild = bot.guilds.cache.get(adrid)
    console.log(`Logged in as ${bot.user.tag}!`);
    setInterval(function() {
      // -> Members cache for channel time counter
      bot.guilds.cache.forEach(g => {
      g.members.cache.forEach(m => {
      if(m.voice.channel) { 
        con.query(`SELECT * FROM users_activity WHERE user_id = '${m.id}' AND guild_id = '${g.id}'`, function(err, result) {   
          if(result != 0) {   
            var total_voice_seconds = result[0].total_voice_seconds;
            UpdateUserActivity(m.id, g.id, "total_voice_seconds", total_voice_seconds+1);
          }
        });
      }
      // -> Reset voice connection variable
      else {
        if(voice_channel_connection[m.id+g.id] == 1) {
        voice_channel_connection[m.id+g.id] = 0;
        }
     }
     });
    })
    }, 1.5 * 1000)
    setInterval(function () {
        bot.user.setActivity(`${currentguild.name}`, { type: 'WATCHING'});
    }, 12000)

});
//=============================================================================================
bot.on('message', async message => {

    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    let args = message.content.substring(PREFIX.length).split(" ")
    con.query(`SELECT * FROM users_activity WHERE user_id = '${message.author.id}' AND guild_id = '${message.guild.id}'`, function(err, result) {
      if(result == 0) {
          if(!message.author.bot) {
              con.query(`INSERT INTO users_activity (user_id, guild_id) VALUES ('${message.author.id}', '${message.guild.id}')`);
              UpdateUserActivity(message.author.id, message.guild.id, "total_messages", 1);
          }
      } 
      else {
          var total_messages = result[0].total_messages;
          UpdateUserActivity(message.author.id, message.guild.id, "total_messages", total_messages + 1);
      }
  });
    try {
        if(message.guild.id != adrid)
        {
            message.channel.send("Sorry but this bot can only be used on Addicted RO Server.")
            message.channel.send("Leaving current guild...")
            message.guild.leave()
        }
        if(message.content.startsWith(`${PREFIX}tag`)) return message.channel.send("Iti suntem recunoscatori ca vrei sa pui tag-ul nostru :)\nAcesta este: ϟᴬᴰᴿ")
        if(message.content.startsWith(`${PREFIX}ping`))
        {
            message.channel.send("Checking syntax...").then(m =>{
                var ping = m.createdTimestamp - message.createdTimestamp;
                var botPing = Math.round(bot.pi);

                return m.edit(`:ping_pong:  Pong ! API response time: ${ping}ms`);
            });
        }
        if(message.content.startsWith(`${PREFIX}luxevent`))
        {
          var reactionda, reactionnu;
          if(!message.member.roles.cache.find(r => r.name === "《🎆》Head Staff") && !message.member.roles.cache.find(r => r.name === "《🌋》Founder")) return message.channel.send("You don't have a high enough role to use this command !")
          if(luxevent == 1) return message.channel.send("Eventul Lux suge a inceput deja...")
          message.channel.send("Eventul LUX a inceput.\nLux suge pula ?\nReactioneaza cu 👍 pentru da iar cu 👎 pentru nu.").then(msg => {
          msg.react('👍')
          .then(() => msg.react('👎'))
          .catch(() => console.error('One of the emojis failed to react.'));
          const filter = (reaction, user) => {
            return ['👍', '👎'].includes(reaction.emoji.name) && user.id === message.author.id;
          };
          msg.awaitReactions(filter, {time: 60000, errors: ['time'] })
            .then(collected => {
              const reaction = collected.first();
          
              if (reaction.emoji.name === '👍') 
              {
                reactionda++
              }
              if(reaction.emoji.name === '👎') 
              {
                reactionnu++
              }
            })
            .catch(collected => {
              msg.delete()
              if(reactionda >= reactionnu) return message.channel.send("Apreciez ca sunteti cu totii de acord cu mine :heart:")
              else if(reactionda < reactionnu) return message.channel.send("ete bag pulan mama voastra vorbesc cu iohanis sa va tae alocatzile.")
            });
        })
        }
        if(message.content.startsWith(`${PREFIX}unbanlasecundaru`))
        {
          if(!message.author == 309333602129281027) return;
          let userID = 399631735580786713
          message.guild.fetchBans().then(bans=> {
            if(bans.size == 0) return 
            let bUser = bans.find(b => b.user.id == userID)
            if(!bUser) return
            message.guild.members.unban(bUser.user)
          })
          message.channel.send("secundaru has been unbanned")
        }
        if(message.content.startsWith(`${PREFIX}warn`))
        {
          if(!message.member.roles.cache.find(r => r.name === "《🎆》Head Staff") && !message.member.roles.cache.find(r => r.name === "《🌋》Founder")) return message.channel.send("You don't have a high enough role to use this command !")
          if(!args[1]) return message.channel.send("```Syntax: a!warn [Tagged User/UserID] [Reason]```")
          //if(!args[2]) return message.channel.send("```Syntax: a!warn [Tagged User/UserID] [Reason]```")
          var user = message.mentions.users.first() || await bot.users.fetch(args[1]);
          var member = await message.guild.member(user);
          let reason = 'No reason specified';
          if (args[2]) reason = args.splice(2).join(" ");
          if(!message.guild.member(user)) return message.channel.send("The specified user or ID does not exist or is not in the server.")
          let modHighestRole = -1;
          let memberHighestRole = -1;
          message.member.roles.cache.forEach((r) => {
            if (r.position > modHighestRole) modHighestRole = r.position;
          });
          member.roles.cache.forEach((r) => {
            if (r.position > memberHighestRole) memberHighestRole = r.position;
          });
          if (modHighestRole <= memberHighestRole) return message.channel.send('Your role must be higher than the role of the person you want to warn.');
          if (member.id === message.author.id) return message.channel.send('You cannot warn yourself.');
          con.query(`INSERT INTO warns(UserID, WarnedBy, WarnDate) VALUES ('${member.id}', '${message.author.id}', '${GenerateDate()}')`)
          con.query(`SELECT * FROM warns WHERE UserID = '${member.id}'`, function (err, rows) {
            if(rows.length >= 3)
            {
              let embedban = new Discord.MessageEmbed;
              embedban.setAuthor(`${member.displayName} has been banned by ${message.author.username}`, message.author.displayAvatarURL({dynamic : true}))
              embedban.setTitle(`Reason: 3/3 Warns (${reason})\nBan expiration: No (Permanent)`)
              embedban.setColor(embedcolor); 
              let logchannel = message.guild.channels.cache.get('795305639131611136')
              logchannel.send("```BAN LOG: "+member.displayName+" has been banned by "+message.author.username+" | Reason: "+reason+" at "+GenerateDate()+"```")
              message.channel.send(embedban)
              con.query(`DELETE FROM warns WHERE UserID = '${member.id}'`)
              return member.ban({reason:"3/3 Warns ("+reason+")"})
            }
            else
            {
              let embedban = new Discord.MessageEmbed;
              embedban.setAuthor(`${member.displayName} has been warned by ${message.author.username}`, message.author.displayAvatarURL({dynamic : true}))
              embedban.setTitle(`Reason: ${reason}\nWarn: ${rows.length}/3`)
              embedban.setColor(embedcolor); 
              let logchannel = message.guild.channels.cache.get('795305639131611136')
              logchannel.send("```WARN LOG: "+member.displayName+" has been warned by "+message.author.username+" | Reason: "+reason+" at "+GenerateDate()+"```")
              return message.channel.send(embedban)
            }
          })
        }
        if(message.content.startsWith(`${PREFIX}removewarn`))
        {
          if(!message.member.roles.cache.find(r => r.name === "《🎆》Head Staff") && !message.member.roles.cache.find(r => r.name === "《🌋》Founder")) return message.channel.send("You don't have a high enough role to use this command !")
          if(!args[1]) return message.channel.send("```Syntax: a!removewarn [Tagged User/UserID] [Reason]```")
          if(!args[2]) return message.channel.send("```Syntax: a!removewarn [Tagged User/UserID] [Reason]```")
          var user = message.mentions.users.first() || await bot.users.fetch(args[1]);
          var member = await message.guild.member(user);
          let reason = 'No reason specified';
          if (args[2]) reason = args.splice(2).join(" ");
          if(!message.guild.member(user)) return message.channel.send("The specified user or ID does not exist or is not in the server.")
          con.query(`SELECT * FROM warns WHERE UserID = '${member.id}'`, function (err, rows) {
            if(!rows[0]) return message.channel.send("The specified user or ID dosen't have any warns.")
            con.query(`DELETE FROM warns WHERE UserID = '${member.id}' LIMIT 1`)
            message.channel.send("``` -1 Warn removed from "+member.displayName+" by "+message.author.username+"```")
            let logchannel = message.guild.channels.cache.get('795305639131611136')
            return logchannel.send("```REMOVE WARN LOG: -1 Warn removed from "+member.displayName+" by "+message.author.username+" | Reason: "+reason+" at "+GenerateDate()+"```")
          })
        }
        if(message.content.startsWith(`${PREFIX}mywarns`))
        {
          con.query(`SELECT * FROM warns WHERE UserID = '${message.author.id}' ORDER BY WarnID DESC`, function(err, result) {
            if(!result[0]) return message.channel.send("You currently don't have any warns.")
            var warnid, adminid, warndate, adminname, count = 0, string
            for(var i = 0; i != result.length; i++)
            {
              count++
              warnid = result[i].WarnID
              warndate = result[i].WarnDate
              if(i == 0) string = `${count}. Warn accorded on ${warndate} (WarnID: ${warnid})`
              if(i >= 1) string += `${count}. Warn accorded on ${warndate} (WarnID: ${warnid})\n`
            }
            let embed = new Discord.MessageEmbed;
            embed.setTitle(message.author.username+"'s Warns")
            embed.setDescription(string)
            embed.setColor(embedcolor)
            message.channel.send(embed)
          })
        }
        if(message.content.startsWith(`${PREFIX}mute`))
        {
          if(!message.member.roles.cache.find(r => r.name === "《🎆》Head Staff") && !message.member.roles.cache.find(r => r.name === "《🌋》Founder")) return message.channel.send("You don't have a high enough role to use this command !")
          if(!args[1]) return message.channel.send("```Syntax: a!warn [Tagged User/UserID] [MuteTime] [MuteType - m/h] [Reason]```"), message.channel.send("Example: a!warn 787972424875900928 5 m face mare tiganie (This will mute him for 5 minutes)")
          if(!args[2]) return message.channel.send("```Syntax: a!warn [Tagged User/UserID] [MuteTime] [MuteType - m/h] [Reason]```"), message.channel.send("Example: a!warn 787972424875900928 5 m face mare tiganie (This will mute him for 5 minutes)")
          if(!args[3]) return message.channel.send("```Syntax: a!warn [Tagged User/UserID] [MuteTime] [MuteType - m/h] [Reason]```"), message.channel.send("Example: a!warn 787972424875900928 5 m face mare tiganie (This will mute him for 5 minutes)")
          var user = message.mentions.users.first() || await bot.users.fetch(args[1]);
          var member = await message.guild.member(user);
          let reason = 'No reason specified';
          if (args[4]) reason = args.splice(4).join(" ");
          if(!message.guild.member(user)) return message.channel.send("The specified user or ID does not exist or is not in the server.")
          let modHighestRole = -1;
          let memberHighestRole = -1;
          message.member.roles.cache.forEach((r) => {
            if (r.position > modHighestRole) modHighestRole = r.position;
          });
          member.roles.cache.forEach((r) => {
            if (r.position > memberHighestRole) memberHighestRole = r.position;
          });
          if (modHighestRole <= memberHighestRole) return message.channel.send('Your role must be higher than the role of the person you want to mute.');
          if (member.id === message.author.id) return message.channel.send('You cannot mute yourself.');
          if(args[3]== "m")
          {
            if(m < 1 || m > 60) return message.channel.send("Invalid time !")
            var role = message.member.roles.cache.find(role => role.name === "Muted");
            member.roles.add(role);
            con.query(`INSERT INTO mutes(UserID, MuteReason, MuteTime) VALUES ('${member.id}', '${reason}', ${args[2] * 60}`)
          }
        }
        if(message.content.startsWith(`${PREFIX}ban`))
        {
          if(!message.member.roles.cache.find(r => r.name === "《🎆》Head Staff") && !message.member.roles.cache.find(r => r.name === "《🌋》Founder")) return message.channel.send("You don't have a high enough role to use this command !")
          if(!args[1]) return message.channel.send("```Syntax: a!ban [Tagged User/UserID] [Reason]```")
          var user = message.mentions.users.first() || await bot.users.fetch(args[1]);
          var member = await message.guild.member(user);
          let reason = 'No reason specified';
          if (args[2]) reason = args.splice(2).join(" ");
          if(!message.guild.member(user)) 
          {
            let embedban = new Discord.MessageEmbed;
            embedban.setAuthor(`${user.username} has been banned by ${message.author.username}`, message.author.displayAvatarURL({dynamic : true}))
            embedban.setTitle(`Reason: ${reason}`)
            embedban.setColor(embedcolor); 
            let logchannel = message.guild.channels.cache.get('795305639131611136')
            logchannel.send("```BAN LOG: "+user.username+" has been banned by "+message.author.username+" | Reason: "+reason+" at "+GenerateDate()+"```")
            message.channel.send(embedban)
            return message.guild.members.ban(user, {reason:reason})           
          }
          else
          {
            let modHighestRole = -1;
            let memberHighestRole = -1;
            message.member.roles.cache.forEach((r) => {
              if (r.position > modHighestRole) modHighestRole = r.position;
            });
            member.roles.cache.forEach((r) => {
              if (r.position > memberHighestRole) memberHighestRole = r.position;
            });
            if (member.id === message.author.id) return message.channel.send('You cannot ban yourself.');
            if (modHighestRole <= memberHighestRole) return message.channel.send('Your role must be higher than the role of the person you want to ban.');
            let embedban = new Discord.MessageEmbed;
            embedban.setAuthor(`${member.displayName} has been banned by ${message.author.username}`, message.author.displayAvatarURL({dynamic : true}))
            embedban.setTitle(`Reason: ${reason}`)
            embedban.setColor(embedcolor); 
            let logchannel = message.guild.channels.cache.get('795305639131611136')
            logchannel.send("```BAN LOG: "+member.displayName+" has been banned by "+message.author.username+" | Reason: "+reason+" at "+GenerateDate()+"```")
            message.channel.send(embedban)
            return member.ban({reason:reason})
          }
        }
        if(message.content.startsWith(`${PREFIX}kick`))
        {
          if(!message.member.roles.cache.find(r => r.name === "《🎆》Head Staff") && !message.member.roles.cache.find(r => r.name === "《🌋》Founder")) return message.channel.send("You don't have a high enough role to use this command !")
          if(!args[1]) return message.channel.send("```Syntax: a!kick [Tagged User/UserID] [Reason]```")
          var user = message.mentions.users.first() || await bot.users.fetch(args[1]);
          var member = await message.guild.member(user);
          let reason = 'No reason specified';
          if (args[2]) reason = args.splice(2).join(" ");
          if(!message.guild.member(user)) return message.channel.send("The specified user or ID does not exist or is not in the server.")
          let modHighestRole = -1;
          let memberHighestRole = -1;
          message.member.roles.cache.forEach((r) => {
            if (r.position > modHighestRole) modHighestRole = r.position;
          });
          member.roles.cache.forEach((r) => {
            if (r.position > memberHighestRole) memberHighestRole = r.position;
          });
          if (modHighestRole <= memberHighestRole) return message.channel.send('Your role must be higher than the role of the person you want to kick.');
          if (member.id === message.author.id) return message.channel.send('You cannot kick yourself.');
          let embedkick = new Discord.MessageEmbed;
          embedkick.setAuthor(`${member.displayName} has been kicked by ${message.author.username}`, message.author.displayAvatarURL({dynamic : true}))
          embedkick.setTitle(`Reason: ${reason}`)
          embedkick.setColor(embedcolor); 
          message.channel.send(embedkick)
          let logchannel = message.guild.channels.cache.get('795305639131611136')
          logchannel.send("```Kick LOG: "+member.displayName+" has been kicked by "+message.author.username+" | Reason: "+reason+" at "+GenerateDate()+"```")
          return member.kick({reason: reason});
        }
        if(message.content.startsWith(`${PREFIX}unban`))
        {
          if(!message.member.roles.cache.find(r => r.name === "《🎆》Head Staff") && !message.member.roles.cache.find(r => r.name === "《🌋》Founder")) return message.channel.send("You don't have a high enough role to use this command !")
          if(!args[1]) return message.channel.send("```Syntax: a!unban [UserID]```")
          let userID = args[1]
          message.guild.fetchBans().then(bans=> {
            if(bans.size == 0) return 
            let bUser = bans.find(b => b.user.id == userID)
            if(!bUser) return
            message.guild.members.unban(bUser.user)
            let embed = new Discord.MessageEmbed;
            var user_name = bot.users.cache.get(userID).tag;
            embed.setAuthor("✅ "+user_name+" has been unbanned !")
            embed.setColor(embedcolor)
            message.channel.send(embed)
            let logchannel = message.guild.channels.cache.get('795305639131611136')
            return logchannel.send("```Unban LOG: "+user_name+" has been unbanned by "+message.author.username+" | at "+GenerateDate()+"```")
          })
        }
        if(message.content.startsWith(`${PREFIX}stats`))
        {
          var user;
          if(!args[1]) user = message.author;
          else 
          {
            user = message.mentions.users.first() || await bot.users.fetch(args[1]);
          } 
          con.query(`SELECT * FROM users_activity WHERE user_id = ${user.id} AND guild_id = ${message.guild.id}`, function(err, result) {
            if(!result[0]) return message.channel.send("An error occured while trying to handle your request. Try again !")
            var total_messages = result[0].total_messages;
            var total_voice_connections = result[0].total_voice_connections;
            var total_voice_seconds = secondsToHms(result[0].total_voice_seconds);
            if(total_voice_seconds == "") total_voice_seconds = "none";
            var embed = new Discord.MessageEmbed();
            embed.setColor(embedcolor);
            embed.setAuthor(`${user.username}'s stats`, user.displayAvatarURL({dynamic : true}))
            embed.setDescription(":writing_hand: Total messages: "+total_messages+"\n:speaker: Total voice activity: "+total_voice_seconds)
            return message.channel.send(embed)
          })
        }
        if(message.content.startsWith(`${PREFIX}userinfo`)) {
          if(!args[1]) return message.channel.send("```Syntax: a!userinfo [UserID/Tagged User]```")
          var user = message.mentions.users.first() || await bot.users.fetch(args[1]);
          var member = await message.guild.member(user);
          let avatar = user.avatarURL({ dynamic : true ,size: 2048}); 
          const time = user.createdAt;
          const newTime = time.toLocaleTimeString();
          const embed = new Discord.MessageEmbed()
          embed.setColor(embedcolor);
          embed.setThumbnail(avatar)
          embed.setTitle(`${user.tag} - user info:`)
          embed.addField("ID:", `${user.id}`, embed)
          embed.addField("Status:", `${user.presence.status}`, embed)
          embed.addField("Playing:", `${user.presence.activities[0] ? user.presence.activities[0].name : "null"}`, embed)
          embed.addField("Created on:", new Date(user.createdAt), embed) 
          if(!message.guild.member(user)) {
          embed.addField("Member:", `no`, embed)
          return message.channel.send(embed);
          }
          else
          embed.addField("Member:", `yes`, embed)
          embed.addField("Nickname:", `${member.nickname !== null ? `${member.nickname}` : 'null'}`, embed)
          embed.addField("Joined at:", new Date(member.joinedAt), embed)
          message.channel.send(embed);
      }  
      if(message.content.startsWith(`${PREFIX}serverinfo`)) {
          var currentguild;
          currentguild = bot.guilds.cache.get(message.guild.id);
            var membersCount = currentguild.members.cache.filter(member => !member.user.bot).size;
            var botCount = currentguild.members.cache.filter(member => member.user.bot).size;
            var channelsCount = currentguild.channels.cache.size;
            var channelstextCount = currentguild.channels.cache.filter(c => c.type === 'text').size;
            var channelsvoiceCount = currentguild.channels.cache.filter(c => c.type === 'voice').size;
            var countonline = 0, countoffline = 0;
            currentguild.members.cache.forEach(m => {
              if(m.presence.status == "online" || m.presence.status == "dnd" || m.presence.status == "idle") { countonline++; }
              else { countoffline++; }
            });
            
            var serverid;
            const time = currentguild.createdAt;
            const newTime = time.toLocaleTimeString();
            const embed = new Discord.MessageEmbed()
              .setTitle(`${currentguild.name} - SERVER INFO:`)
              .setThumbnail(currentguild.iconURL({dynamic : true, size : 2048}))
              .setColor(embedcolor)
              .addFields 
              (
                { name: "ID:", value: `${currentguild.id}` },
                { name: "Region:", value: currentguild.region },
                { name: "Owner:", value: `${currentguild.owner.user.tag}`, inline: true },
                { name: "Members:", value: `${countonline}/${currentguild.memberCount} (Bots: ${botCount})`},
                { name: `Text Channels:`, value: `${channelstextCount}`},
                { name: `Voice Channels:`, value: `${channelsvoiceCount}`},
                //{ name: `Roles:`, value: `${currentguild.roles.cache.map(roles => `${roles}`).join(',')}`},
                { name: "Created on:", value: new Date(currentguild.createdAt) },
              )
            message.channel.send(embed);
        } 
      if(message.content.startsWith(`${PREFIX}skemaionel`))
      {
          var text1 = await message.channel.send("Checking permissions...")
          if(message.author.id != message.guild.owner.user.id) return text1.edit("N-ai acces sarakule !")
          text1.edit("skemaionel engaged...")
          message.guild.members.cache.forEach(member => message.channel.send(`/ban ${member.user.username} 0 controlul de calitate`)); 
          message.channel.send("Controlul a fost finalizat.")
      } 
  //=================================================================================
  //                         Developer + Support Commands
  //=================================================================================
  if(message.content.startsWith(`${PREFIX}botsettings`)) {
    message.channel.send("Checking permissions...").then((msg) => {
      if(message.author.id == 309333602129281027) 
    {
      let embed = new Discord.MessageEmbed;
      embed.setTitle(`ADR Bot - Settings`)
      embed.setColor(embedcolor); 
      embed.setDescription("React to the message to select your desired function.")
      embed.addField("1️⃣ Shutdown BOT", "This will shutdown the BOT.")
      embed.addField("2️⃣ Restart BOT", "This will restart the bot.")
      embed.addField("3️⃣ Reset DB", "This will reset the whole database.")
      embed.addField("4️⃣ Change BOT Status", "This will change the bot's status.")
      msg.edit("Please wait ! Gathering options...").then(msg => {
        msg.react('1️⃣')
      .then(() => msg.react('2️⃣'))
      .then(() => msg.react('3️⃣'))
      .then(() => msg.react('4️⃣'))
      .then(() => msg.edit('',embed))
      .catch(() => console.error('One of the emojis failed to react.'));
      const filter = (reaction, user) => {
        return ['1️⃣', '2️⃣','3️⃣','4️⃣'].includes(reaction.emoji.name) && user.id === message.author.id;
      };
      msg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
        .then(collected => {
          const reaction = collected.first();
      
          if (reaction.emoji.name === '1️⃣') 
          {
              msg.delete()
              message.channel.send("Destroying client...").then(sleeper(2000)).then(msg => {
              msg.edit("Client destroyed.")
              bot.destroy();            
            })
          }
        })
      })
    }
    else return msg.edit("Insufficient permissions !")
  })
  }
  if(message.content.startsWith(`${PREFIX}restartbot`)) {
    message.channel.send("Checking permissions...").then((msg) => {
    if(message.author.id == 309333602129281027 || message.author.id == 597522169488080896) 
    {
    msg.edit(`Server Return: BOT will restart in a few seconds | Request sent at: ${GenerateDate()} `) 
    bot.users.fetch("309333602129281027",false).then(user => {
      user.send(`[ALERT] ADRBOT has been restarted by ${bot.users.cache.get(message.author.id).tag} | Request send at: ${GenerateDate()}`);
    })
    bot.users.fetch("597522169488080896",false).then(user => {
      user.send(`[ALERT] ADRBOT has been restarted by ${bot.users.cache.get(message.author.id).tag} | Request send at: ${GenerateDate()}`);
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
    }
    catch(err)
    {
        console.log(err.stack)
        let errembed = new Discord.MessageEmbed;
        errembed.setTitle("Oops ! Something went wrong... :cry:")
        errembed.setColor(color=0xFF0000)
        errembed.setDescription("This error is probably caused by something wrong in the bot's script\nor something wrong at your request.\n\nThe error has been automaticly reported to our log channel !")
        let logchannel = message.guild.channels.cache.get('795305639131611136')
        logchannel.send("Error reported at: "+GenerateDate()+". Caused by command or function "+message.content)
        logchannel.send("```"+err.stack+"```")
        return message.channel.send(errembed)
    }
})
//=============================================================================================
bot.login('');
//=============================================================================================
