require('dotenv').config();
const { google } = require('googleapis');

async function createLoyaltyClass() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/wallet_object.issuer'],
  });

  const client = await auth.getClient();
  const issuerId = process.env.GOOGLE_ISSUER_ID;

  const loyaltyClass = {
    id: `${issuerId}.fidelite_class`,
    issuerName: 'Ma Boutique',
    programName: 'Carte Fidélité',
    programLogo: {
     sourceUri: { uri: 'https://img.icons8.com/color/96/coffee-to-go.png' },
      contentDescription: { defaultValue: { language: 'fr-FR', value: 'Logo' } }
    },
    rewardsTierLabel: 'Tampons',
    rewardsTier: 'Standard',
    reviewStatus: 'UNDER_REVIEW',
  };

  try {
    const response = await client.request({
      url: `https://walletobjects.googleapis.com/walletobjects/v1/loyaltyClass`,
      method: 'POST',
      data: loyaltyClass,
    });
    console.log('✅ Classe créée :', response.data.id);
  } catch (err) {
    if (err.response?.status === 409) {
      console.log('✅ Classe déjà existante, tout va bien !');
    } else {
      console.error('❌ Erreur :', err.response?.data || err.message);
    }
  }
}

createLoyaltyClass();