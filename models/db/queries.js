const createCssEntryQuery = 'INSERT INTO css_entries (css_code) VALUES ($1) RETURNING *';

module.exports = {
  createCssEntryQuery
};
