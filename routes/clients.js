const express = require('express');
const router = express.Router();
const db = require('../database');

router.post('/ajouter', (req, res) => {
  const { prenom, email } = req.body;

  if (!prenom || !email) {
    return res.status(400).json({ erreur: 'Prénom et email obligatoires' });
  }

  try {
    db.ajouterClient(prenom, email);
    res.json({ message: `✅ Client ${prenom} ajouté !` });
  } catch (err) {
    res.status(500).json({ erreur: 'Email déjà utilisé ou erreur serveur' });
  }
});

router.post('/tampon', (req, res) => {
  const { email } = req.body;
  const client = db.getClientParEmail(email);

  if (!client) {
    return res.status(404).json({ erreur: 'Client introuvable' });
  }

  db.ajouterTampon(email);
  const clientMaj = db.getClientParEmail(email);
  res.json({
    message: `✅ Tampon ajouté !`,
    prenom: clientMaj.prenom,
    tampons: clientMaj.tampons
  });
});

router.get('/liste', (req, res) => {
  const clients = db.tousLesClients();
  res.json(clients);
});

module.exports = router;