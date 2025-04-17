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

// Ensure banner folder exists
if (!fs.existsSync(bannerFolder)) {
  console.error('❌ "banners/" folder is missing!')
  process.exit(1)
}

// Load banners
let banners = fs.readdirSync(bannerFolder).filter(file => /\.(jpe?g|png|gif)$/i.test(file))

if (banners.length === 0) {
  console.error('⚠️ No banner images found in the "banners/" folder.')
  process.exit(1)
}

// Random banner rotation
async function changeBanner() {
  try {
    const guild = await client.guilds.fetch(guildId)
    const randomBanner = banners[Math.floor(Math.random() * banners.length)]
    const imagePath = path.join(bannerFolder, randomBanner)

    await guild.setBanner(fs.readFileSync(imagePath))
    console.log(`🔁 Updated banner to random: ${randomBanner}`)
  } catch (err) {
    console.error('❌ Error changing banner:', err)
  }
}

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`)

  // Auto banner rotation every 35 mins
  cron.schedule('*/35 * * * *', async () => {
    await changeBanner()
  })
})

// Manual commands
client.on('messageCreate', async (message) => {
  const content = message.content.toLowerCase()

  if (message.author.id !== ownerId) return

  // !!change - Random banner now
  if (content === '!!change') {
    await changeBanner()
    return message.reply('✅ Banner changed manually (random)')
  }

  // !!banner <number> - Set specific banner
  if (content.startsWith('!!banner')) {
    const parts = content.split(' ')
    const index = parseInt(parts[1]) - 1

    if (isNaN(index) || index < 0 || index >= banners.length) {
      return message.reply(`❌ Please enter a valid number between 1 and ${banners.length}`)
    }

    const bannerFile = banners[index]
    const imagePath = path.join(bannerFolder, bannerFile)

    try {
      const guild = await client.guilds.fetch(guildId)
      await guild.setBanner(fs.readFileSync(imagePath))
      message.reply(`✅ Banner #${index + 1} (${bannerFile}) has been set!`)
      console.log(`🛠 Manually set banner to: ${bannerFile}`)
    } catch (err) {
      console.error('❌ Error setting specific banner:', err)
      message.reply('⚠️ Failed to update banner.')
    }
  }
})

client.login(token)
