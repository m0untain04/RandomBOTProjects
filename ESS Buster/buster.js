const Discord = require('discord.js')
const bot = new Discord.Client();
const token = ''
const mysql = require("mysql");
const queue = new Map();
var colors = require('colors');

var prefix;
var onlychannelaccess;
var asd;

bot.on('ready', () =>
{
    console.log('The bot is online!');
    bot.user.setUsername("ESSBuster");
});

var con = mysql.createConnection({
    host: "193.203.39.132",
    user: "nicolaiulian",
    password: "",
    database: "nicolaiulian"
});

con.connect(err => 
{
    if(err) throw err;
    console.log(`Connected To Database!`);
    con.query("SHOW TABLES", console.log);
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    con.query(`SELECT * FROM DiscordBotSettings`, function (err, result, fields) {
    if(err) throw err;
    if(result == 0) return false;
    else 
    {
        prefix = result[0].Prefix;
        onlychannelaccess = result[0].ChannelIDAccess;
        //CheckServerStatus();
        //bot.on('ready', () => { bot.user.setActivity('Grand Theft Auto San Andreas - Players online: ', { type: 'PLAYING' }); });
        bot.on('ready', () => { bot.user.setActivity(`${result[0].Prefix}cmds`); });
    }
    });
    // user name -> ${message.author.username}

});
function UpdateSettings(row, value) { con.query(`UPDATE DiscordBotSettings SET ${row} = '${value}'`); }

// -> Checking if server account are associated with the discord account 
/*function GetPlayerLoggedIn(name)
{
	var LoggedIn;
	con.query(`SELECT * FROM DiscordSession WHERE DiscordName = '${name}'`, function (err, result, fields) 
	{
		if(err) throw err;
		if(result == 0) LoggedIn = 0;
		else if(result != 0) LoggedIn = 1;
	});
	return LoggedIn;
}*/
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var cmdfrombot = false;
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
bot.on('message', async message =>
{
    var channelaccess, cmdexist = false;
    if(onlychannelaccess == `1`) channelaccess = 1;
    else 
    {
        if(message.channel.id === `${onlychannelaccess}`) channelaccess = 1;
        else channelaccess = 0;
    }
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    let prefixs = ["~", "`", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "=", "+", "[", "]", "{", "}", ";", ":", "'", '"', "|", ",", "<", ".", ">", "/", "?"];
    let options = ["sugi pula ba du-te-n mortii ma-tii de ratat", "sa o fut pe ma-ta", "o sa imi bag pl de robot in ma-ta daca nu incetezi", "ce ratat esti", "fgm de bou", "cacat cu ochi"];
    function SCM(Text) { message.channel.send(`${Text}`); cmdfrombot = true; }
    function SendError(ErrorID, Error) { message.channel.send(`**ERROR:**  ${Error} (Error #${ErrorID})`); cmdfrombot = true; }
    function SendUsage(Usage) { message.channel.send(`:bulb: **USAGE:** ${prefix}${Usage}`); cmdfrombot = true; }
    function ErrorType(type) 
    { 
        switch(type)
        {
            case 1: SCM("**This channel cannot be used for ESSBUSTER commands.**"); 
        }
        cmdfrombot = true;
    }
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    if(message.mentions.members.first() !== undefined && message.mentions.members.first().id === bot.user.id) SCM(`**USE:** ${prefix}cmds!`);
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    let params = message.content.substring().split(" ")
    var CMD = params[0];
    var MSG = message.content;
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // -> Chat
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    if(MSG == 'cf essbuster') 
    {
        var response = options[Math.floor(Math.random()*options.length)];
        SCM(`${response}`);
    }
	//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// -> Anti Ads by Ghost
	//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	/*for(var i = 1111; i < 9999; i++)
	if(message.content.includes(`:${i}`) && !message.content.includes(`::`))
	{
		message.reply("You cannot use server ads!");
		message.delete({ timeout: 1}); 
	}*/
	if(message.content.includes('discord.gg' || 'discordapp.com/invite' || 'discord.gg/' || 'discordapp.com/invite/'))
	{
		message.reply("You cannot use server ads!");
		message.delete({ timeout: 1}); 
	}
	if(message.content.includes("You cannot use server ads!") && message.member.id == bot.user.id) message.delete({ timeout: 3000});
	//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    if(message.mentions.members.first() !== undefined)
    {
        if(message.mentions.members.first().id === "410172675047161856") SCM("Die since 1999-2020 march 18");
        //if(message.mentions.members.first().id === "419548294390218752") SCM("Baaa, stiati ca asta pe care l-au mentionat mai sus, e homo-sexual?");
        if(message.mentions.members.first().id === "310462391467114497") SCM("Ce vrei ma de la gay-ul asta?");
		if(message.mentions.members.first().id === "597522169488080896") SCM("Ce vrei ma de la fraierul asta?? Mai bine incearca la altu'(PS: era doar un sfat)");
    }
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // -> CMD LIST
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    if(CMD == `${prefix}kick`)
    {
        cmdexist = true;
        if(channelaccess == 0) return ErrorType(1);
        if(!message.member.hasPermission("KICK_MEMBERS")) return SendError(1, "You doesn't have permission for this command!");
        if(params[1] && params[2]) 
        {
            if(!isNaN(params[1])) var tempstring = `SELECT * FROM Accounts WHERE PlayerIDConnect = '${params[1]}' AND LoggedIn = '1'`;
            else if(isNaN(params[1])) var tempstring = `SELECT * FROM Accounts WHERE Name = '${params[1]}' AND LoggedIn = '1'`;
            //++++++++++++++++++++++++++++++++++++++++++++++++++
            con.query(`${tempstring}`, function (err, result, fields) {
            if(err) throw err;
            if(result == 0) return SendError(2, "Player are not connected!");
            else 
            {
                var playername = result[0].Name;
                var rcontype = result[0].RconType;
                //++++++++++++++++++++++++++++++++++++++++++++++
                if(rcontype == 3) return SendError(3, "You cannot use this command on this player!");
                //++++++++++++++++++++++++++++++++++++++++++++++
                SCM(`Kicking player **${playername}** from the server\nReason: **${params[2]}**`);
                //++++++++++++++++++++++++++++++++++++++++++++++
                var sql = (`UPDATE Accounts SET Kicked = '1', KickType = '2', KickReason = '${params[2]}', KickAdmin = '${message.member.user.tag}' WHERE Name = '${playername}'`);
                con.query(sql);
            }
            });
        }
        else return SendUsage("kick [ID/Player Name] [Reason]"), SCM(`**PONT:** ${prefix}onlinep to get players ID!`);
    }
    else if(CMD == `${prefix}ban`)
    {
        cmdexist = true;
        if(channelaccess == 0) return ErrorType(1);
        if(!message.member.hasPermission("KICK_MEMBERS")) return SendError(1, "You doesn't have permission for this command!");
        if(params[1] && params[2] && params[3])
        {
            if(!isNaN(params[2]))
            {
                if(params[2] < 1 || params[2] > 299) return SendError(2, "You can ban a player between 1-299 days!");
                //++++++++++++++++++++++++++++++++++++++++++++++
                if(!isNaN(params[1])) var tempstring = `SELECT * FROM Accounts WHERE PlayerIDConnect = '${params[1]}' AND LoggedIn = '1'`;
                else if(isNaN(params[1])) var tempstring = `SELECT * FROM Accounts WHERE Name = '${params[1]}' AND LoggedIn = '1'`;
                //++++++++++++++++++++++++++++++++++++++++++++++
                con.query(`${tempstring}`, function (err, result, fields) {
                if(err) throw err;
                if(result == 0) return SendError(3, "Player are not connected!");
                else 
                {
                    var playername = result[0].Name;
                    var rcontype = result[0].RconType;
                    //++++++++++++++++++++++++++++++++++++++++++
                    if(rcontype == 3) return SendError(3, "You cannot use this command on this player!");
                    //++++++++++++++++++++++++++++++++++++++++++
                    SCM(`Banning player **${playername}** from the server\nDay(s): **${params[2]}**\nReason: **${params[3]}**`);
                    //++++++++++++++++++++++++++++++++++++++++++
                    var sql = (`UPDATE Accounts SET Banned = '1', BanDays = '${params[2]}', BanReason = '${params[3]}', BanAdmin = '${message.member.user.tag}' WHERE Name = '${playername}'`);
                    con.query(sql);
                }
                });
            }
            else return SendError(1, "You need to input numbers to parameter **Day(s)**!")
        }
        else return SendUsage("ban [ID/Player Name] [Day(s)] [Reason]"), SCM(`**PONT:** ${prefix}onlinep to get players ID!`);
    }
    else if(CMD == `${prefix}unban`)
    {
        cmdexist = true;
        if(channelaccess == 0) return ErrorType(1);
        if(!message.member.hasPermission("ADMINISTRATOR")) return SendError(1, "You doesn't have permission for this command!");
        if(params[1])
        {
            con.query(`SELECT * FROM Bans WHERE Name = '${params[1]}'`, function (err, result, fields) {
            if(err) throw err;
            if(result == 0) return SendError(2, "Player are not banned!");
            else 
            {
                SCM(`I was succesfully unbanned **${params[1]}** from server!`);
                //++++++++++++++++++++++++++++++++++++++++++++++
                var sql = (`DELETE FROM Bans WHERE Name = '${params[1]}'`);
                con.query(sql); 
            }
            });
        }
        else return SendUsage("unban [Player Name]");
    }
    else if(CMD == `${prefix}banlist`)
    {
        cmdexist = true;
        if(channelaccess == 0) return ErrorType(1);
		if(!message.member.hasPermission("ADMINISTRATOR")) return SendError(1, "You doesn't have permission for this command!");
		con.query(`SELECT * FROM Bans WHERE ID > 0 ORDER BY ID DESC`, function (err, result, fields) {
		if(result == 0) return SendError(2, "No existing bans in our database!");	
		else
		{
            var tempstring;
            result.forEach(function(row)
            {
                tempstring = `Name: **${row.Name}** by **${row.Admin}**\n${tempstring}`;
            })
            SCM(`>>> ${tempstring}\n\n**USE:** /bandetail [Player Name] to get more info`);
		}
		});
    }
    else if(CMD == `${prefix}onlinep`)
    {
        cmdexist = true;
        if(channelaccess == 0) return ErrorType(1);
		if(!message.member.hasPermission("ADMINISTRATOR")) return SendError(1, "You doesn't have permission for this command!");
		con.query(`SELECT * FROM Accounts WHERE LoggedIn = '1' ORDER BY PlayerIDConnect DESC`, function (err, result, fields) {
		if(result == 0) return SendError(2, "No online players yet!");	
		else
		{
            var tempstring, tempstring2;
            result.forEach(function(row)
            {
                tempstring = `Name: **${row.Name}**\tID **${row.PlayerIDConnect}**`;
                tempstring2 = `${tempstring}\n${tempstring2}`;
            }); 
            SCM(`>>> ${tempstring2}\nTotal players online: ${result.length}`);
		}
		});
    }
    else if(CMD == `${prefix}whitelist`)
    {
        cmdexist = true;
		if(!message.member.hasPermission("ADMINISTRATOR")) return SendError(1, "You doesn't have permission for this command!");
        if(params[1])
        {
            if(params[1] == "all")
            {
                SCM(`**INFO:** BOT access has been seted to channel: **All**!`);
                UpdateSettings("ChannelIDAccess", 1);
                onlychannelaccess = `1`;
            }
            else if(params[1] != "all")
            {
                if(!isNaN(params[1]))
                {
                    var lengths = params[1].length;
                    if(lengths != 18) return SendError(3, "Numbers lengths must have 18 numbers!");
                    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                    bot.channels.fetch(`${params[1]}`).then(channel =>
                    {
                        SCM(`**INFO:** BOT access has been seted to channel: **${channel.name}**!`); 
                        UpdateSettings("ChannelIDAccess", channel.id);
                        onlychannelaccess = `${channel.id}`;
                    });
                }
                else return SendError(2, "String must contain only numbers for this option!");
            }
            else return SendError(1, "Invalid string!");
        }
        else return SendUsage("whitelist [Channel ID/All]");
    }
    else if(CMD == `${prefix}prefix`)
    {
        cmdexist = true;
		if(!message.member.hasPermission("ADMINISTRATOR")) return SendError(1, "You doesn't have permission for this command!");
        if(channelaccess == 0) return ErrorType(1);
        if(params[1]) 
        {
            if(prefixs.indexOf(params[1]) == -1) return SendError(1, "Invalid prefix!");
            prefix = params[1];
            UpdateSettings("Prefix", params[1]);
            bot.user.setActivity(`${prefix}cmds`); 
            SCM(`Prefix has been changed to **${params[1]}**`)
        }
        else return SCM(`**Curent Prefix:** ${prefix}\n**USE:** ${prefix}prefix [New Prefix] to change!`)
    }
	else if(CMD == `${prefix}say`)
	{
		cmdexist = true;
		if(!message.member.hasPermission("ADMINISTRATOR")) return SendError(1, "You doesn't have permission for this command!");
		if(params[1]) 
		{ 
			for(var i = 1; i < 100; i++)
			if(params[i] != undefined)
			{
				message.delete({ timeout: 1}); 
				SCM(`${params[i]}`); 
			}
		}
		else return message.delete({ timeout: 1});
	}
	else if(CMD == `${prefix}spam`)
	{
		cmdexist = true;
		if(!message.member.hasPermission("ADMINISTRATOR")) return SendError(1, "You doesn't have permission for this command!");
		if(params[1])
		{
			for(var i = 0; i < 1000; i++) { SCM(`${params[1]}`); }
		}
		else return SendUsage("spam [text]");
	}
	else if(CMD == `${prefix}setrank`)
	{
		cmdexist = true;
		if(channelaccess == 0) return ErrorType(1);
		var LoggedIn;
		
		con.query(`SELECT * FROM DiscordSession WHERE DiscordName = '${message.author.username}${message.member.user.tag}'`, function (err, result, fields) 
		{
			if(err) throw err;
			if(result == 0) LoggedIn = 0;
			else if(result != 0) LoggedIn = 1;
		});
		
		if(LoggedIn == 1)
		{	
			if(!message.member.hasPermission("ADMINISTRATOR")) return SendError(1, "You doesn't have permission for this command!");
			if(params[1] && params[2] && params[3])
			{
				switch(params[2])
				{
					case 1:
					{
					}
					case 2:
					{
					}
				}
			}
			else return SendUsage("setrank [Server Name **or** Discord Mention] [Type (1 - Server | 2 - Discord)] [demote/rcon/support/manager]");
		}
		else return SendError(1, `You need to be login! Please DM ESSBUSTER with command **${prefix}login**`);
	}
    else if(CMD == `${prefix}cmds`) 
    {
        cmdexist = true;
        if(channelaccess == 0) return ErrorType(1);
        SCM(`
		>>> **ESSBUSTER Commands:**\n
		\**${prefix}kick** - Kick an online player
		\**${prefix}ban** - Ban an online player
		\**${prefix}unban** - Unban a banned player
		\**${prefix}banlist** - Show all banned players
		\**${prefix}onlinep** - View all connected players
		\**${prefix}whitelist** - Change BOT access for a channel
		\**${prefix}prefix** - Change BOT prefix
		\**${prefix}say** - Type something, and it will display from the BOT
		\**${prefix}spam** - Type something, and it will spamed in the chat\n\
		\n**I'm developed by **Ghosty#1631`);
    }
	else if(CMD == `${prefix}server`)
	{
		if(params[1] == "start" || params[1] == "stop" || params[1] == "restart")
		{
			message.channel.send(`Connecting to samp.ess-ro.com:7777`).then((message) => {
				var SSH = require('simple-ssh');
				var ssh = new SSH({
					host: '193.84.64.80',
					user: 'root',
                    pass: '',
                    agent: process.env.SSH_AUTH_SOCK
				});
				ssh.exec('echo $PATH', {
					out: function(stdout) {
						console.log(stdout);
					}
				}).start();
				 
				ssh.exec(`/home/samp/./samp.sh ${params[1]}`, {
					out: function(stdout) {
						ssh.end();
					message.edit(`${stdout}`);
					}
				})
			})
		}
		else return SendUsage("server [start/stop/restart]");
	}
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // -> Automatically Message Delete 
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    if(message.channel.id == `${onlychannelaccess}` && cmdexist == false && message.member.id != bot.user.id) 
    {
        message.reply("Please use only **BOT COMMANDS** in this channel!");
        message.delete({ timeout: 1});
        cmdfrombot = false;
    }
    if(message.channel.id == `${onlychannelaccess}` && cmdfrombot == false && message.member.id == bot.user.id) { message.delete({ timeout: 2000}); }
});
bot.login(token);
