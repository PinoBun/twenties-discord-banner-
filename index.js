const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js')
const cron = require('node-cron')
const fs = require('fs')
const path = require('path')

const token = process.env.TOKEN
const guildId = process.env.GUILD_ID
const ownerId = process.env.OWNER_ID

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
})

const bannerFolder = './banners'
let banners = fs.readdirSync(bannerFolder)

async function changeBanner() {
  try {
    const guild = await client.guilds.fetch(guildId)
    const randomBanner = banners[Math.floor(Math.random() * banners.length)]
    const imagePath = path.join(bannerFolder, randomBanner)

    await guild.setBanner(fs.readFileSync(imagePath))
    console.log(`updated banner to ${randomBanner}`)
  } catch (err) {
    console.error('error changing banner:', err.message)
  }
}

client.once('ready', () => {
  console.log(`logged in as ${client.user.tag}`)

  cron.schedule('*/35 * * * *', async () => {
    await changeBanner()
  })
})

client.on('messageCreate', async (message) => {
  if (message.content.toLowerCase() === '!!change' && message.author.id === ownerId) {
    await changeBanner()
    message.reply('banner changed manually')
  }
})

client.login(token)
