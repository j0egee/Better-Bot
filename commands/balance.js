module.exports = {
  name: "balance",
  aliases: ["bal", "money"],
  permissions: [],
  cooldown: 0.1,
  description: "Check the user balance",
  execute(client, message, cmd, args, Discord, profileData) {

    if(message.member.roles.cache.has('898604884528603136')) return message.reply('You are blocked from this servers economy.');

    const embed = new Discord.MessageEmbed()
      .setColor('FADF2E')
      .setTimestamp(Date.now())
      .setFooter(`Bot created by j0egee#0001`, "https://cdn.discordapp.com/attachments/845366607080456265/861746867008569384/Untitled_Artwork_3.png")
      .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
      .setTitle('Your balance is:')
      .setDescription(`**Coins**- *${profileData.coins.toLocaleString()}*`);

    message.channel.send({embeds: [embed]})
  },
};