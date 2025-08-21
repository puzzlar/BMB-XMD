'use strict';

require('dotenv').config();
const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const fs = require('fs-extra');
const settings = require('./settings.js');

// Start the bot
async function startBot() {
    try {
        // Load SESSION_ID from environment
        const SESSION_ID = process.env.SESSION_ID;
        if (!SESSION_ID) {
            console.error("❌ No SESSION_ID found! Please set it in Railway Variables.");
            process.exit(1);
        }

        console.log(`🚀 Starting bot: ${settings.BOT} by ${settings.OWNER_NAME}`);

        // Initialize WhatsApp connection
        const { state, saveCreds } = await useMultiFileAuthState('./auth_info_baileys');

        const sock = makeWASocket({
            auth: state,
            printQRInTerminal: false // Railway cannot show QR, so SESSION_ID is required
        });

        sock.ev.on('creds.update', saveCreds);

        sock.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect } = update;
            if (connection === 'open') {
                console.log('✅ Bot connected to WhatsApp successfully!');
            } else if (connection === 'close') {
                console.log('⚠️ Connection closed. Retrying...', lastDisconnect?.error || '');
                startBot();
            }
        });
    } catch (err) {
        console.error("❌ Error starting bot:", err);
    }
}

startBot();