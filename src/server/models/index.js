import Anime from "./anime.js";
import AnimeSet from "./animeSet.js";
import Gender from "./gender.js";
import User from "./user.js";
import AnimeCoverArt from "./animeCovertArt.js";
import Studio from "./studio.js";

export default function init(bookshelf) {
  return {
    Anime: Anime(bookshelf),
    AnimeSet: AnimeSet(bookshelf),
    Gender: Gender(bookshelf),
    User: User(bookshelf),
    AnimeCoverArt: AnimeCoverArt(bookshelf),
    Studio: Studio(bookshelf),
  };
}
