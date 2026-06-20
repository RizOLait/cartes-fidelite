require('dotenv').config();
const express = require('express');
const path = require('path');        // ← ligne 3
const app = express();

app.use(express.json());
app.use(express.static(__dirname + '/public'));

app.use('/api/clients', require('./routes/clients'));

app.get('/', (req, res) => {         // ← ces 3 lignes
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {             // ← dernière ligne, elle reste à la fin
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});