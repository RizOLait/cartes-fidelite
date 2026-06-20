const jwt = require('jsonwebtoken');

function generateGooglePassUrl(client) {
  const issuerId = process.env.GOOGLE_ISSUER_ID;
  const classId = `${issuerId}.fidelite_class`;
  const objectId = `${issuerId}.client_${client.id}`;

  const tampons = client.tampons || 0;
  const progression = `${'☕'.repeat(tampons)}${'⬜'.repeat(Math.max(0, 6 - tampons))}`;

  const loyaltyObject = {
    id: objectId,
    classId: classId,
    state: 'ACTIVE',
    accountId: `${client.id}`,
    accountName: client.prenom,
    loyaltyPoints: {
      balance: { int: tampons },
      label: 'Tampons',
    },
    textModulesData: [
      {
        header: 'Progression',
        body: `${progression} — ${tampons}/6`,
        id: 'progression'
      },
      {
        header: 'Récompense',
        body: tampons >= 6 ? '🎉 Café offert !' : `Plus que ${6 - tampons} tampon(s) !`,
        id: 'recompense'
      }
    ]
  };

  const claims = {
    iss: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    aud: 'google',
    typ: 'savetowallet',
    iat: Math.floor(Date.now() / 1000),
    payload: {
      loyaltyObjects: [loyaltyObject]
    }
  };

  const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
  const token = jwt.sign(claims, privateKey, { algorithm: 'RS256' });

  return `https://pay.google.com/gp/v/save/${token}`;
}

module.exports = { generateGooglePassUrl };