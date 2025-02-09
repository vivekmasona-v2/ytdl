const express = require("express");
const { exec } = require("child_process");

const app = express();

app.get("/download", (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: "Missing 'url' parameter" });

    // yt-dlp command with browser cookies (no file needed)
    const command = `yt-dlp --cookies-from-browser chrome -j "${url}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) return res.status(500).json({ error: stderr.trim() });

        try {
            const info = JSON.parse(stdout);
            return res.json({ url: info.url });
        } catch (err) {
            return res.status(500).json({ error: "Failed to parse yt-dlp response" });
        }
    });
});

// Vercel requires 'api' folder for serverless functions
module.exports = app;
