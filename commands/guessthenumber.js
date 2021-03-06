const { MessageCollector, MessageEmbed } = require('discord.js');
const profileModel = require("../models/profileSchema");

module.exports = {
    name: 'guessthenumber',
    aliases: ['gtn'],
    permissions: [],
    description: 'Play guess the number',

    execute: async (client, message, cmd, args, Discord, profileData) => {
        let number = Math.ceil(Math.random() * 100);
        let finished = false;

        if(message.member.roles.cache.has('898604884528603136')) return message.reply('You are blocked from this servers economy.');
        
        const userData = await profileModel.findOne({ userID: message.author.id, serverID: message.guild.id });

        const startEmbed = new Discord.MessageEmbed()
        .setTitle(`Guess The Number`)
        .setDescription(`Guess a number (1-100), you have \`1 minute\``)
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .setColor('FADF2E')
        .setTimestamp(Date.now())
        .setFooter(`Bot created by j0egee#0001`, "https://cdn.discordapp.com/attachments/845366607080456265/861746867008569384/Untitled_Artwork_3.png")


        message.channel.send({embeds: [startEmbed]})

        const filter = (m) => m.author.id === message.author.id && m.author.id !== message.guild.me.id


        let collector = new MessageCollector(
        message.channel, {
                filter,
                time: 60000,
        });

        let tries = 0;

        collector.on('collect', async (msg) => {
            if (finished == false) {
                let split = msg.content.split(/ +/);
                let attempt = split.shift();

                if (isNaN(attempt)) return message.reply(`You must choose an actual number`);

                tries++;

                if (parseInt(attempt) !== number) return message.reply(`That is incorrect. Please choose again (My number is ${parseInt(msg) < number ? 'higher' : 'lower'} than ${parseInt(msg)})`)

                finished = true;

                const amount = (5000 / tries).toFixed()

                const finEmbed = new Discord.MessageEmbed()
                .setTitle(`Correct`)
                .setDescription(`${parseInt(msg)} is correct!\n`
                + `It took you ${tries} times to get it\n`
                + `I added ${amount.toLocaleString()} to your balance.`)
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setColor('FADF2E')
                .setTimestamp(Date.now())
                .setFooter(`Bot created by j0egee#0001`, "https://cdn.discordapp.com/attachments/845366607080456265/861746867008569384/Untitled_Artwork_3.png")
        

                message.channel.send({embeds: [finEmbed]})
                await profileModel.findOneAndUpdate({
                    userID: message.author.id,
                    serverID: message.guild.id
                }, {
                    $inc: {
                        coins: amount,
                    },
                }
                );
            }
        });

        collector.on('end', async (collected) => {
            if (finished == false) return message.reply(`You timed out!`);
        });
    }
}