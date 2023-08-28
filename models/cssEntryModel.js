const pool = require('./db/db');
const { createCssEntryQuery } = require('./db/queries');

const CssEntryModel = {
  async createCssEntry(cssCode) {
    try {
      const values = [cssCode];
      const insertedEntry = await pool.query(createCssEntryQuery, values);
      return insertedEntry.rows[0];
    } catch (error) {
      throw error;
    }
  }
};

module.exports = CssEntryModel;
