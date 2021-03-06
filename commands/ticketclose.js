module.exports = {
    name: "ticketclose",
    aliases: [ ],
    permissions: ["KICK_MEMBERS"],
    cooldown: 0.01,
    description: "Pay a member in the server some coins!",
    execute(client, message, cmd, args, Discord, profileData) {

        if (!message.channel.name.startsWith('ticket')) return message.channel.send('You can only run this command inside of a ticket.');

        let reason = message.content.split('-ticketclose ').join("");

        if(!args[0]) return message.reply('Please be sure to include your solution for closing this ticket.');

        const deleteEmbed = new Discord.MessageEmbed()
            .setColor('FADF2E')
            .setTimestamp(Date.now())
            .setFooter(`Bot created by j0egee#0001`, "https://cdn.discordapp.com/attachments/845366607080456265/861746867008569384/Untitled_Artwork_3.png")
            .setTitle(`${message.channel.name} (${message.channel.id})`)
            .setDescription(`Has been deleted by ${message.author.tag}\n\n**${reason}**`);


        message.channel.send("Deleting this channel in 5 seconds!");
        setTimeout(() => message.channel.delete(), 5000);
        message.guild.channels.cache.get('863157013567373332').send({embeds: [deleteEmbed]})
    }

}
