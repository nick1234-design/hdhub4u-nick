const express = require("express");
const { addonBuilder } = require("stremio-addon-sdk");

const manifest = require("./manifest.json");

const builder = new addonBuilder(manifest);

builder.defineStreamHandler(async ({ type, id }) => {
  try {
    const provider = require("./providers/hdhub4u.js");

    const streams = await provider.getStreams(type, id);

    return { streams: Array.isArray(streams) ? streams : [] };
  } catch (error) {
    console.error("HDHub4u stream error:", error.message);
    return { streams: [] };
  }
});

const addonInterface = builder.getInterface();
const app = express();

app.get("/manifest.json", (req, res) => {
  res.json(manifest);
});

app.get("/stream/:type/:id.json", async (req, res) => {
  try {
    const result = await addonInterface.get("stream", req.params.type, req.params.id);
    res.json(result || { streams: [] });
  } catch (error) {
    console.error(error);
    res.json({ streams: [] });
  }
});

app.get("/", (req, res) => {
  res.redirect("/manifest.json");
});

const port = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`HDHub4u Nick running on port ${port}`);
  });
}

module.exports = app;