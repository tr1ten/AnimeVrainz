// Setting up the database connection
import Knex from 'knex';
import config from './config.js';
import Bookshelf from 'bookshelf';

const knex = Knex(config);
const bookshelf = Bookshelf(knex);
export default bookshelf;