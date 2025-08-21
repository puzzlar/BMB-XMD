'use strict';

require('dotenv').config();
const express = require("express");
const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const fs = require('fs-extra');
const settings = require('./settings.js');

// ✅ Add small Express server to keep Railway alive
const app = express();
app.get("/", (req, res) => res.send("✅ B.M.B-Tech bot is running on Railway!"));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Web server running on port ${PORT}`));

// Start the bot
async function startBot() {
    try {
        // Load SESSION_ID from environment
        const SESSION_ID = process.env.SESSION_ID;
        if (!SESSION_ID) {
            console.error("❌ No SESSION_ID found! Please set it in Railway Variables.");
            process.exit(1);
        }

        console.log(`🚀 Starting bot: ${settings.BOT || "B.M.B-TECH"} by ${settings.OWNER_NAME || "Unknown"}`);

        // Initialize WhatsApp connection
        const { state, saveCreds } = await useMultiFileAuthState('./auth_info_baileys');

        const sock = makeWASocket({
            auth: state,
            printQRInTerminal: false // Railway cannot show QR, SESSION_ID must be used
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