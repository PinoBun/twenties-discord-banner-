const { Client, GatewayIntentBits, Permissions } = require('discord.js');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

const token = process.env.TOKEN;
const guildId = process.env.GUILD_ID;
const ownerId = process.env.OWNER_ID;  // The user ID of the bot owner (can be yourself)

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

const bannerFolder = './banners';
let banners = fs.readdirSync(bannerFolder);

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);

  cron.schedule('*/40 * * * *', async () => {
    try {
      const guild = await client.guilds.fetch(guildId);
      const botMember = await guild.members.fetch(client.user.id);

      // Log bot's permissions to check if "Manage Server" is available
      console.log('Bot Permissions:', botMember.permissions.toArray());

      // Ensure bot has the MANAGE_GUILD permission
      if (!botMember.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
        console.log("Bot doesn't have the MANAGE_GUILD permission.");
        return;
      }

      const randomBanner = banners[Math.floor(Math.random() * banners.length)];
      const imagePath = path.join(bannerFolder, randomBanner);

      await guild.setBanner(fs.readFileSync(imagePath));
      console.log(`Updated banner to ${randomBanner}`);
    } catch (err) {
      console.error('Error changing banner:', err.message);
    }
  });

  // Listen for the !!change command to manually trigger a banner change
  client.on('messageCreate', async (message) => {
    if (message.content.toLowerCase() === '!!change' && message.author.id === ownerId) {
      try {
        const guild = await client.guilds.fetch(guildId);
        const botMember = await guild.members.fetch(client.user.id);

        // Check if bot has the necessary permissions to change banner
        if (!botMember.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
          console.log("Bot doesn't have the MANAGE_GUILD permission.");
          return;
        }

        const randomBanner = banners[Math.floor(Math.random() * banners.length)];
        const imagePath = path.join(bannerFolder, randomBanner);

        await guild.setBanner(fs.readFileSync(imagePath));
        message.reply(`Banner changed to ${randomBanner}`);
        console.log(`Manually updated banner to ${randomBanner}`);
      } catch (err) {
        console.error('Error manually changing banner:', err.message);
        message.reply('Failed to change banner. Please check logs.');
      }
    }
  });
});

client.login(token);
