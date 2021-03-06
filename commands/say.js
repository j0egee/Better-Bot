module.exports = {
    name: 'say',
    aliases: [],
    permissions: ["KICK_MEMBERS"],
    description: 'Send a message to a channel in the server!',
    execute(client, message, cmd, args, Discord, profileData) {
        const sayChannel = message.mentions.channels.first()
        if (!sayChannel) return message.channel.send('You must say the channel you wish to talk in.')

        let messageArgs = message.content.split(`-say ${sayChannel}`).join("")

        sayChannel.send(`${messageArgs}`)
        message.channel.send(`I said your message in ${sayChannel}.`)
        message.delete()
    }
}