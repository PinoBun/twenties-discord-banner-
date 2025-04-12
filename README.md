
# Twenties [Discord](https://discord.com/invite/mggbZgHCY8) Banner Bot

A minimal and powerful bot that automatically updates your Discord server banner every 35 minutes. Ideal for aesthetic-focused communities that want to keep their server fresh and engaging without manual updates.

---

## Overview

This bot uses cron jobs to rotate server banners from a local folder. It supports manual overrides through a command restricted to the server owner. Built using `discord.js v14` and `node-cron`, it’s lightweight and easy to deploy.

---

## Features

- Automatically updates Discord server banner every 35 minutes
- Selects a random image from a predefined `banners/` folder
- Manual command (`!!change`) to instantly update the banner
- Uses environment variables for configuration
- Simple, fast setup with minimal dependencies

---

## Folder Structure

```
twenties-discord-banner/
├── banners/           # Your banner images go here (jpg, png, etc.)
├── index.js           # Main bot script
├── package.json       # Project metadata and dependencies
```

---

## Installation and Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/PinoBun/twenties-discord-banner-.git
   cd twenties-discord-banner-
   ```

2. **Install the dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**  
   Create a `.env` file in the root directory with the following values:
   ```
   TOKEN=your-bot-token
   GUILD_ID=your-discord-server-id
   OWNER_ID=your-discord-user-id
   ```

4. **Add banner images**  
   Place your `.jpg`, `.png`, or `.gif` banner files inside the `banners/` folder.

5. **Run the bot**
   ```bash
   npm start
   ```

---

## Command Reference

- `!!change`  
  Manually changes the server banner. Only works if the message author’s ID matches the `OWNER_ID`.

---

## Tech Stack

- Node.js
- [discord.js](https://discord.js.org/)
- [node-cron](https://www.npmjs.com/package/node-cron)

---

## Community

Want to see it in action or have feedback?  
Join our server: [here](https://discord.com/invite/mggbZgHCY8](https://discord.com/invite/mggbZgHCY8)

---

## License

This project is licensed under the MIT License. You are free to use, modify, and distribute this code, but please provide credit where it’s due.
