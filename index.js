const { Client, GatewayIntentBits } = require('discord.js')
const cron = require('node-cron')
const fs = require('fs')
const path = require('path')

const token = process.env.TOKEN
const guildId = process.env.GUILD_ID

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
})

const bannerFolder = './banners'
let banners = fs.readdirSync(bannerFolder)

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`)

  cron.schedule('0 * * * *', async () => {
    try {
      const guild = await client.guilds.fetch(guildId)
      const randomBanner = banners[Math.floor(Math.random() * banners.length)]
      const imagePath = path.join(bannerFolder, randomBanner)

      await guild.setBanner(fs.readFileSync(imagePath))
      console.log(`Updated banner to ${randomBanner}`)
    } catch (err) {
      console.error('Error changing banner:', err.message)
    }
  })
})

client.login(token)
