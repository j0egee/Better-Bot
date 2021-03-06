module.exports = {
    name: 'suggestions',
    aliases: ['suggest', 'sug', 'suggestion'],
    permissions: [],
    cooldown: 10,
    description: 'Creates a suggestion!',
    execute(client, message, cmd, args, Discord, profileData) {
        const channel = message.guild.channels.cache.find(c => c.name === 'suggestions');
        if (!channel) return message.channel.send('This server has no suggestion channel.');

        let messageArgs = args.join(' ');

        if (message.member.roles.cache.has('866922320324329472')) return message.reply('You are banned from making suggestions in this server!');

        if (!messageArgs) return message.channel.send('You must say your suggestion.');

        const embed = new Discord.MessageEmbed()
            .setColor('FADF2E')
            .setTimestamp(Date.now())
            .setAuthor(`Suggestion by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
            .setFooter(`Bot created by j0egee#0001`, "https://cdn.discordapp.com/attachments/845366607080456265/861746867008569384/Untitled_Artwork_3.png")
            .setDescription(messageArgs);

        message.guild.channels.cache.get('863162965004124191').send({embeds: [embed]}).then((msg) => {
            msg.react('👍');
            msg.react('👎');
            message.delete();
        }).catch((err) => {
            throw err;
        });
        return message.reply('I sent your suggestion to <#863162965004124191>!')
    }
}