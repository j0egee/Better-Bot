module.exports = {
    name: 'help',
    permissions: [],
    cooldown: 0.1,
    description: "Show the basic help page!",
    async execute(client, message, cmd, args, Discord, profileData) {
        const embed = new Discord.MessageEmbed()
            .setColor('FADF2E')
            .setFooter(`Bot created by j0egee#0001`, "https://cdn.discordapp.com/attachments/845366607080456265/861746867008569384/Untitled_Artwork_3.png")
            .setTitle(`Basic Better Bot help page`)
            .addField(`-apply`, `Apply for staff on this server!`)
            .addField(`-balance`, `Shows your coin balance for this server.`)
            .addField(`-pay`, `Pay a user in this server coins.`)
            .addField(`-guessthenumber`, `Play a game of guess the number to win coins.`)
            .addField(`-beg`, `Beg for a random amount of coins.`)
            .addField(`-color`, `Set your own chat color.`)
            .addField(`-suggestion`, `Create a suggestion for the server.`)
            .addField(`-shop`, `Bring up the shop page.`)
            .addField(`-ticket`, `Create a ticket in this server.`)
            .addField(`-wiki`, `Show our helpful wiki pages.`)
            .setDescription(`Click the 📈 reaction to view the admin commands.`)

        let messageEmbed = await message.channel.send({embeds: [embed]});

        messageEmbed.react(`📈`)

        const adminEmoji = `📈`

        client.on('messageReactionAdd', async (reaction, user) => {
            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (user !== message.author) return;
            if (!reaction.message.guild) return;
            if(reaction.message.id !== messageEmbed.id) return;
           
            if (reaction.message.guild.id == message.guild.id) {

                if (reaction.emoji.name === adminEmoji) {

                    const adminEmbed = new Discord.MessageEmbed()
                        .setColor('FADF2E')
                        .setFooter(`Bot created by j0egee#0001`, "https://cdn.discordapp.com/attachments/845366607080456265/861746867008569384/Untitled_Artwork_3.png")
                        .setTitle(`Admin Better Bot help page`)
                        .addField(`-accept`, `Accept a members staff application.`)
                        .addField(`-bc`, `Broadcast a message to any channel in the server.`)
                        .addField(`-clear`, `Clear a certian number of messages in chat.`)
                        .addField(`-createdata`, `Create user data for a member in the server if the bot failed to.`)
                        .addField(`-decline`, `Decline a members staff application.`)
                        .addField(`-dm`, `Send a direct message to a member in the server form the bot.`)
                        .addField(`-give`, `Give a member in the server a ceritan amount of coins.`)
                        .addField(`-giveaway`, `Start a server wide giveaway.`)
                        .addField(`-mute`, `Perminatly or temperarlly mute a member in the server.`)
                        .addField(`-say`, `Make the bot send a normal message to any channel in the server.`)
                        .addField(`-set`, `Set a users coin balance.`)
                        .addField(`-unmute`, `Remove a mute form a member in the server.`)
                        .addField(`-userinfo`, `Get the user infomation for a user in the server.`)
                        .setDescription(`Re-run the \`-help\` command to view the player commands.`)

                    await message.channel.send({embeds: [adminEmbed]});
                    messageEmbed.delete()
                }
            }
        }
        )
    }
}