const express = require('express');
const app = express();
app.use(express.json());

const path = require('path');
const sass = require('sass');
const fs = require('fs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/compile-sass', (req, res) => {
  try {
    const sassString = req.body.sassString;
    if (!sassString) {
      return res.status(400).send('Código Sass ausente no corpo da requisição.');
    }

    const result = sass.renderSync({
      data: `${sassString}
            
            @charset "utf-8";
            @import "./node_modules/bulma/bulma.sass";`
    });

    res.send(result.css.toString());

    const cssFilePath = path.join(__dirname, 'public/temp', 'compiled.css');
    fs.writeFileSync(cssFilePath, result.css.toString());
  } catch (error) {
    res.status(500).send('Erro ao compilar Sass: ' + error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});