const profileModel = require("../models/profileSchema");

module.exports = {
    name: 'give',
    permissions: ["ADMINISTRATOR"],
    cooldown: 0.1,
    description: "Give a user coins!",
    async execute(client, message, cmd, args, Discord, profileData) {
        if (!args.length) return message.channel.send('You need to mention a user in this guild.');
        const amount = args[1]
        const target = message.mentions.users.first();
        const targetM = message.mentions.members.first();
        if (!target) return message.channel.sent('The user you mentioned is not in this guild.');

        if(targetM.roles.cache.has('898604884528603136')) return message.reply('You can not pay people blocked by the server economy.');

        if (amount % 1 != 0 || amount <= 0) return message.channel.send('The give amount must be a whole number grater then 0.');

        try {
            const targetData = await profileModel.findOne({ userID: target.id, serverID: message.guild.id });
            if (!targetData) return message.channel.send(`That user doesn't have any data. Please use \`-createdata <user>\``);

            await profileModel.findOneAndUpdate({
                userID: target.id,
                serverID: message.guild.id
            }, {
                $inc: {
                    coins: amount,
                },
            }
            );

            return message.channel.send(`${target} has recived **${amount.toLocaleString()} coins**. They used to have *${targetData.coins.toLocaleString()} coins*.`)
        } catch (err) {
            console.log(err)
        }
    },
};