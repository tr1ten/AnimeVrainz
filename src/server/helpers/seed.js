import fs from "fs";
import csv from "csv-parser";
import { processAnime } from "./utils.js";
import bookshelf from "./bookshelf.js";
import getOrm from "../models/index.js";
// const anime = [];
let count = 0;
const orm = getOrm(bookshelf);
async function addToDb(row) {
  if (count > 0) {
    return;
  }
  try {
    const { aired, studio, episodes, title, background } = row;
    const anime = {};
    anime.aired = new Date(JSON.parse(aired.replace(/'/g, '"')).from);
    anime.studios = studio
      .trim()
      .split(",")
      .map((nam) => ({ name: nam }));
    anime.episodes_count = episodes;
    anime.title = title?.trim() ?? "";
    anime.synopsis = background?.trim() ?? "";
    count++;
    console.log("added anime #", count, ":", anime);
    await bookshelf.transaction(async (transaction) => {
      await transaction
        .raw("SET CONSTRAINTS ALL DEFERRED")
      await processAnime(anime, orm, transaction)
      console.log("transaction finished");
      return;
    });
  } catch (err) {
    console.log("skipping row", err);
  }
}

fs.createReadStream("data.csv")
  .pipe(csv())
  .on("data", addToDb)
  .on("end", function () {
    console.log("finished seeding!");
  });
