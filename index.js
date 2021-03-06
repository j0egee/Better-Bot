const Discord = require('discord.js');
const { Intents } = Discord;
require(`dotenv`).config()

const intents = new Intents ();

for(const intent of Object.keys (Intents.FLAGS)){
intents.add(intent);
intents.add(Intents.FLAGS.DIRECT_MESSAGES)
}


const client = new Discord.Client ({
  intents: intents
});

const mongoose = require('mongoose');

const fs = require('fs');

const memberCounter = require ('./counters/member-counter');
const muteRemover = require ('./counters/mute-remover');

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

client.on("ready", async () => {
    client.user.setActivity("you | -help ", { type: "WATCHING" });
    client.channels.cache.get('863156995201040384').send(`Restart successful! I am now back online! Timestamp: <t:${(Date.now()/1000).toFixed()}:F>`);
    memberCounter(client)
    muteRemover(client)
})

client.on('guildMemberAdd', async guildMember => {

    guildMember.guild.channels.cache.get('863163477854257162').send(`Welcome <@${guildMember.user.id}> to the **AD Center Discord Server**! Please read over <#863155069243228161> :)`)

    const muteSchema = require("./models/mute-schema");

    const currentMute = await muteSchema.findOne({
        userID: guildMember.id,
        guildID: guildMember.guild.id,
        current: true
    })

    let muteRole = guildMember.guild.roles.cache.find(role => role.name === 'Muted');

    if (currentMute) {
        guildMember.roles.add(muteRole)
        client.channels.cache.get('863156995201040384').send(`${currentMute.userTag} has just bypassed there mute. They are now re-muted! Originally muted by <@${currentMute.staffID}>`)
    }
    else { return }
});

['command_handler', 'event_handler'].forEach(handler => {
    require(`./handlers/${handler}`)(client, Discord);
})

mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to the database.');
}).catch((err) => {
    console.log(err);
});

client.on("messageCreate", async (message, guild, Discord) => {

    const { MessageEmbed } = require('discord.js')

    if (message.channel.type === "DM" && !message.author.bot) {
        const dmEmbed = new MessageEmbed()
            .setColor('FADF2E')
            .setTimestamp(Date.now())
            .setFooter(`Bot created by j0egee#0001`, "https://cdn.discordapp.com/attachments/845366607080456265/861746867008569384/Untitled_Artwork_3.png")
            .setAuthor(`New DM from ${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`${message.content}`)

        const DMC = client.channels.cache.get('863156995201040384')
        DMC.send({embeds: [dmEmbed]})
    }
})


client.on('messageUpdate', async (oldMessage, newMessage) => {

    if(!oldMessage.content) return; 
    if(!newMessage.content) return;

    if(oldMessage.author.bot) return;

    const muembed = new Discord.MessageEmbed()
        .setColor('FADF2E')
        .setTimestamp(Date.now())
        .setFooter(`Bot created by j0egee#0001`, "https://cdn.discordapp.com/attachments/845366607080456265/861746867008569384/Untitled_Artwork_3.png")
        .setTitle('Message update')
        .setDescription(`${oldMessage.author}'s message was updated in ${oldMessage.channel}`)
        .addField('Jump to message', `[CLICK HERE](https://discord.com/channels/${oldMessage.guild.id}/${oldMessage.channel.id}/${oldMessage.id})`)
        .addField(`Old message`, `${oldMessage.content}`)
        .addField(`New message`, `${newMessage.content}`)

    let logs = oldMessage.guild.channels.cache.get('863156995201040384')
    logs.send({embeds: [muembed]})
})
client.on('messageDelete', async (message) => {

    if(!message.content) return;

    if(message.author.bot) return;
    
    const mdembed = new Discord.MessageEmbed()
        .setColor('FADF2E')
        .setTimestamp(Date.now())
        .setFooter(`Bot created by j0egee#0001`, "https://cdn.discordapp.com/attachments/845366607080456265/861746867008569384/Untitled_Artwork_3.png")
        .setTitle('Message delete')
        .setDescription(`${message.author}'s message was deleted in ${message.channel}`)
        .addField(`Message content`, `${message.content}`)

    let logs = message.guild.channels.cache.get('863156995201040384')
    logs.send({embeds: [mdembed]})
})

client.on("guildMemberUpdate", async (oldMember, newMember) => {

    if (oldMember.roles.cache.size > newMember.roles.cache.size) {

        const Embed = new Discord.MessageEmbed();
        Embed.setColor('FADF2E');
        Embed.setTimestamp(Date.now());
        Embed.setTitle(`Member updated!`);
        Embed.setAuthor(newMember.user.tag, oldMember.user.displayAvatarURL({ format: "png", dynamic: true }));
        Embed.setFooter(`Bot created by j0egee#0001`, "https://cdn.discordapp.com/attachments/845366607080456265/861746867008569384/Untitled_Artwork_3.png");
        Embed.addField(`Member`, `<@${newMember.user.id}>`);

        const fetchedLogs = await oldMember.guild.fetchAuditLogs({
            limit: 1,
            type: 'UPDATED_ROLE',
        });

        const rRoleLog = fetchedLogs.entries.first();

        const { executor } = rRoleLog;

        Embed.addField("Removed by", `<@${executor.id}>`);

        oldMember.roles.cache.forEach(role => {
            if (!newMember.roles.cache.has(role.id)) {
                Embed.addField("Role Removed", `${role}`);
            }
        });

        client.channels.cache.get("863156995201040384").send({embeds: [Embed]});
    } else if (oldMember.roles.cache.size < newMember.roles.cache.size) {
        const Embed = new Discord.MessageEmbed();
        Embed.setColor('FADF2E');
        Embed.setTitle(`Member updated!`);
        Embed.setAuthor(newMember.user.tag, oldMember.user.displayAvatarURL({ format: "png", dynamic: true }));
        Embed.setTimestamp(Date.now());
        Embed.setFooter(`Bot created by j0egee#0001`, "https://cdn.discordapp.com/attachments/845366607080456265/861746867008569384/Untitled_Artwork_3.png");
        Embed.addField(`Member`, `<@${newMember.user.id}>`);

        const fetchedLogs = await oldMember.guild.fetchAuditLogs({
            limit: 1,
            type: 'UPDATED_ROLE',
        });

        const aRoleLog = fetchedLogs.entries.first();

        const { executor } = aRoleLog;
        
        Embed.addField("Added by", `<@${executor.id}>`);

        newMember.roles.cache.forEach(role => {
            if (!oldMember.roles.cache.has(role.id)) {
                Embed.addField("Role Added", `${role}`);
            }
        });
        client.channels.cache.get("863156995201040384").send({embeds: [Embed]});
    };

    if (!oldMember.nickname && newMember.nickname) {
        const membernewnicklog = new Discord.MessageEmbed()
            .setAuthor(`${newMember.user.tag}`, `${newMember.user.displayAvatarURL({ format: "png", dynamic: true })}`)
            .setTitle(`Member updated!`)
            .setColor('FADF2E')
            .setTimestamp(Date.now())
            .setFooter(`Bot created by j0egee#0001`, "https://cdn.discordapp.com/attachments/845366607080456265/861746867008569384/Untitled_Artwork_3.png")
            .addField("New nickname", `${newMember.nickname}`)
        client.channels.cache.get('863156995201040384').send({embeds: [membernewnicklog]});
        return;
    }
    if (oldMember.nickname && !newMember.nickname) {
        const memberremovenicklog = new Discord.MessageEmbed()
            .setAuthor(`${oldMember.user.tag}`, `${oldMember.user.displayAvatarURL({ format: "png", dynamic: true })}`)
            .setTitle(`Member updated!`)
            .setColor('FADF2E')
            .setTimestamp(Date.now())
            .setFooter(`Bot created by j0egee#0001`, "https://cdn.discordapp.com/attachments/845366607080456265/861746867008569384/Untitled_Artwork_3.png")
            .addField("Removed nickname", `${oldMember.nickname}`)
        client.channels.cache.get('863156995201040384').send({embeds: [memberremovenicklog]});
        return;
    }
    if (oldMember.nickname && newMember.nickname) {
        const memberchangednicklog = new Discord.MessageEmbed()
            .setAuthor(`${newMember.user.tag}`, `${newMember.user.displayAvatarURL({ format: "png", dynamic: true })}`)
            .setTitle(`Member updated!`)
            .setColor('FADF2E')
            .setTimestamp(Date.now())
            .setFooter(`Bot created by j0egee#0001`, "https://cdn.discordapp.com/attachments/845366607080456265/861746867008569384/Untitled_Artwork_3.png")
            .addField("Nickname before", `${oldMember.nickname}`)
            .addField("Nickname after", `${newMember.nickname}`);
        client.channels.cache.get('863156995201040384').send({embeds: [memberchangednicklog]});
        return;
    }
});

client.on('guildMemberRemove', async member => {
    const fetchedLogs = await member.guild.fetchAuditLogs({
        limit: 1,
        type: 'MEMBER_KICK',
    });

    const kickLog = fetchedLogs.entries.first();

    if (!kickLog) return console.log(`${member.user.tag} left the guild, most likely of their own will.`);

    const { executor, target, reason } = kickLog;

    let kickEmbed = new Discord.MessageEmbed()
        .setColor('FADF2E')
        .setTimestamp(Date.now())
        .setFooter(`Bot created by j0egee#0001`, "https://cdn.discordapp.com/attachments/845366607080456265/861746867008569384/Untitled_Artwork_3.png")
        .setTitle('Member kicked!')
        .setAuthor(executor.tag, executor.displayAvatarURL({ dynamic: true }))
        .setDescription(`${member.user.tag} was kicked by ${executor.tag} for ${reason}`);

    if (target.id === member.id) {
        let logs = member.guild.channels.cache.get('863156995201040384')
        logs.send({embeds: [kickEmbed]})
        client.users.cache.get('473850297702285322').send({embeds: [kickEmbed]});;
    } else {
        console.log(`${member.user.tag} left the guild, audit log fetch was inconclusive.`);
    }
});


client.on('guildBanAdd', async (guild, user) => {
    const fetchedLogs = await guild.fetchAuditLogs({
        limit: 1,
        type: 'MEMBER_BAN_ADD',
    });

    const banLog = fetchedLogs.entries.first();

    if (!banLog) return console.log(`${user.tag} was banned from ${guild.name} but no audit log could be found.`);

    const { executor, target, reason } = banLog;

    let banEmbed = new Discord.MessageEmbed()
        .setColor('FADF2E')
        .setTimestamp(Date.now())
        .setAuthor(`${executor.tag}`, executor.displayAvatarURL({ dynamic: true }))
        .setFooter(`Bot created by j0egee#0001`, "https://cdn.discordapp.com/attachments/845366607080456265/861746867008569384/Untitled_Artwork_3.png")
        .setTitle('Member banned!')
        .setDescription(`${user.tag} was banned by ${executor.tag} for ${reason}`);

    if (target.id === user.id) {
        let logs = guild.channels.cache.get('863156995201040384')
        logs.send({embeds: [banEmbed]})
        client.users.cache.get('473850297702285322').send({embeds: [banEmbed]});
    } else {
        console.log(`${user.tag} got hit with the swift hammer of justice in the guild ${guild.name}, audit log fetch was inconclusive.`);
    }
});
client.on('guildBanRemove', async (guild, user) => {
    const fetchedLogs = await guild.fetchAuditLogs({
        limit: 1,
        type: 'MEMBER_BAN_REMOVE',
    });

    const rbanLog = fetchedLogs.entries.first();

    if (!rbanLog) return console.log(`${user.tag} was unbanned from ${guild.name} but no audit log could be found.`);

    const { executor, target } = rbanLog;

    let rbanEmbed = new Discord.MessageEmbed()
        .setColor('FADF2E')
        .setTimestamp(Date.now())
        .setAuthor(executor.tag, executor.displayAvatarURL({ dynamic: true }))
        .setFooter(`Bot created by j0egee#0001`, "https://cdn.discordapp.com/attachments/845366607080456265/861746867008569384/Untitled_Artwork_3.png")
        .setTitle('Member unbanned!')
        .setDescription(`${user.tag} was unbanned by ${executor.tag}!`);

    if (target.id === user.id) {
        let logs = guild.channels.cache.get('863156995201040384')
        logs.send({embeds: [rbanEmbed]})
        client.users.cache.get('473850297702285322').send({embeds: [rbanEmbed]});
    } else {
        console.log(`${user.tag} unbanned from ${guild.name}, audit log fetch was inconclusive.`);
    }
});



client.login(process.env.TOKEN);