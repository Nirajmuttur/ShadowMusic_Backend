import cheerio from "cheerio";
import ytdl from "ytdl-core";
import { Request, Response } from "express";
import puppeter from "puppeteer";
import fs from "fs";
import { asyncHandler } from "../utils/asyncHandler";

export const getIdByName = asyncHandler(async (req: Request, res: Response) => {
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
  res.writeHead(200,{"Content-Type":"audio/mp3"});
  ytdl(`https://www.youtube.com/${trackUrl}`, {
    filter: "audioonly",
  }).pipe(res)
});
