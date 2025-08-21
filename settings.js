const fs = require('fs-extra');
const { Sequelize } = require('sequelize');

if (fs.existsSync('settings.env'))
    require('dotenv').config({ path: __dirname + '/settings.env' });

const path = require("path");
const databasePath = path.join(__dirname, './database.db');

// If Railway provides DATABASE_URL, use it. Otherwise, fallback to local sqlite
const DATABASE_URL = process.env.DATABASE_URL || databasePath;

module.exports = {
    session: process.env.SESSION_ID || '',
    PREFIXE: process.env.PREFIX || "+",
    OWNER_NAME: process.env.OWNER_NAME || "PUZZLAR_SKIPPER",
    NUMERO_OWNER: process.env.NUMERO_OWNER || "254718850915",
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    BOT: process.env.BOT_NAME || 'KENNIX_SKIPPER',
    URL: process.env.BOT_MENU_LINKS || 'https://files.catbox.moe/8qq3l4.jpg',
    MODE: process.env.PUBLIC_MODE || "yes",
    PM_PERMIT: process.env.PM_PERMIT || 'yes',
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME,
    HEROKU_API_KEY: process.env.HEROKU_API_KEY,
    WARN_COUNT: process.env.WARN_COUNT || '3',
    ETAT: process.env.PRESENCE || '',
    ANTICALL: process.env.ANTICALL || 'yes',
    AUTO_BIO: process.env.AUTO_BIO || 'no',
    DP: process.env.STARTING_BOT_MESSAGE || "yes",
    ANTIDELETE1: process.env.ANTI_DELETE_MESSAGE || 'yes',
    AUTO_REACT: process.env.AUTO_REACT || 'no',
    AUTO_REACT_STATUS: process.env.AUTO_REACT_STATUS || 'no',
    AUTO_READ: process.env.AUTO_READ || 'yes',
    CHAT_BOT: process.env.CHAT_BOT || 'yes',
    AUDIO_REPLY: process.env.AUDIO_REPLY || 'no',

    // Database configs
    DATABASE_URL,
    DATABASE: DATABASE_URL,   // no hardcoding, relies on Railway
};

let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});