const fs = require('fs');
const sass = require('sass');
const path = require('path');
const CssEntryModel = require('../models/cssEntryModel');

const sassController = {
  async compileSass(req, res) {
    try {
      const sassString = req.body.sassString;
      const result = sass.renderSync({
        data: `${sassString} \n\n@charset "utf-8";\n@import "./node_modules/bulma/bulma.sass";`
      });

      const cssCode = result.css.toString();
      const cssFilePath = path.join(__dirname, '../public/css', 'test.css');
      fs.writeFileSync(cssFilePath, cssCode);
      res.send(cssCode);
    } catch (error) {
      res.status(500).send('Erro ao compilar Sass: ' + error.message);
    }
  },

  async saveToDatabase(req, res) {
    const { cssCode } = req.body;

    try {
      const insertedEntry = await CssEntryModel.createCssEntry(cssCode);
      res.send({ message: 'CSS salvo no banco de dados.', entryId: insertedEntry.id });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Erro ao salvar no banco de dados.' });
    }
  }
};

module.exports = sassController;
