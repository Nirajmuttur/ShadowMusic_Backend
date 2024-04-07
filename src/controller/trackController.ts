import cheerio from "cheerio";
import ytdl from "ytdl-core";
import { Request, Response } from "express";
import puppeter from "puppeteer";
import fs from "fs";

export const getIdByName = async (req: Request, res: Response) => {
  let songName = req.params.id.replace(" ", "+");
  console.log(process.env.SCRAPE_URL + songName);

  const browser = await puppeter.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(process.env.SCRAPE_URL + songName);
  const pageData = await page.evaluate(() => {
    return {
      html: document.documentElement.innerHTML,
    };
  });
  const $ = cheerio.load(pageData.html);
  let trackUrl = $('a[id="video-title"]').attr("href");

  console.log(trackUrl);
  const audio = ytdl(`https://www.youtube.com/${trackUrl}`, {
    filter: "audioonly",
  });
  res.writeHead(200,{"Content-Type":"audio/mp3"});
  audio.pipe(fs.createWriteStream(`${songName}.mp3`));
  audio.on("response", (resp) => {
    resp.on("data", (chunk:any) => {
      res.write(chunk)
    });
  });
  audio.on("finish", () => {
    console.log("finished");
    res.end();
  });
};
