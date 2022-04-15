import bookshelf from "./helpers/bookshelf.js";
import getOrm from "./models/index.js";
const orm = getOrm(bookshelf);
const gender = new orm.Gender({ label: "Female" });
gender.save().then(() => {
  console.log("byee");
  bookshelf.knex.destroy();
});
