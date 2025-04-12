const { Client, GatewayIntentBits } = require('discord.js')
const cron = require('node-cron')
const fs = require('fs')
const path = require('path')

// Access Railway environment variables
const token = process.env.TOKEN         // Your bot token
const guildId = process.env.GUILD_ID   // Your guild ID (server)
const ownerId = process.env.OWNER_ID   // Your Discord user ID
const bannerFolder = './banners'

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
})

let banners = fs.readdirSync(bannerFolder)

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`)

  // Auto change banner every 40 minutes
  cron.schedule('*/40 * * * *', async () => {
    const maxRetries = 3
    let attempt = 0
    let success = false

    while (attempt < maxRetries && !success) {
      try {
        const guild = await client.guilds.fetch(guildId)

        const supportsGif = guild.premiumTier === 3
        const allowedExtensions = supportsGif
          ? ['.png', '.jpg', '.jpeg', '.gif']
          : ['.png', '.jpg', '.jpeg']

        banners = fs.readdirSync(bannerFolder).filter(file =>
          allowedExtensions.includes(path.extname(file).toLowerCase())
        )

        if (banners.length === 0) {
          console.warn('No valid banners found')
          return
        }

        const randomBanner = banners[Math.floor(Math.random() * banners.length)]
        const imagePath = path.join(bannerFolder, randomBanner)

        await guild.setBanner(fs.readFileSync(imagePath))
        console.log(`Updated banner to ${randomBanner}`)
        success = true
      } catch (err) {
        attempt++
        console.error(`Attempt ${attempt} failed:`, err)
        if (attempt < maxRetries) {
          console.log('Retrying...')
        } else {
          console.log('All attempts failed. Skipping this cycle.')
        }
      }
    }
  })

  // Listen for the !!change command
  client.on('messageCreate', async (message) => {
    if (message.author.bot) return

    if (message.content === '!!change' && message.author.id === ownerId) {
      try {
        const guild = await client.guilds.fetch(guildId)

        const supportsGif = guild.premiumTier === 3
        const allowedExtensions = supportsGif
          ? ['.png', '.jpg', '.jpeg', '.gif']
          : ['.png', '.jpg', '.jpeg']

        banners = fs.readdirSync(bannerFolder).filter(file =>
          allowedExtensions.includes(path.extname(file).toLowerCase())
        )

        if (banners.length === 0) {
          message.reply('no valid banners found')
          return
        }

        const randomBanner = banners[Math.floor(Math.random() * banners.length)]
        const imagePath = path.join(bannerFolder, randomBanner)

        await guild.setBanner(fs.readFileSync(imagePath))
        message.reply(`banner changed to **${randomBanner}**`)
      } catch (err) {
        console.error('Error during manual banner change:', err)
        message.reply('failed to change banner')
      }
    }
  })
})

client.login(token)
