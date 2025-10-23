/**
 * Générateur de hash bcrypt pour les mots de passe
 * Utiliser ce script pour générer des hash pour la base de données
 * 
 * Usage:
 * node generate-password-hash.js motdepasse
 */

const readline = require('readline');

// Simulation bcrypt (à remplacer par vrai bcrypt si installé)
async function generateHash(password) {
  console.log('\n📝 Génération du hash pour le mot de passe:', password);
  console.log('\n⚠️  IMPORTANT: Installez bcrypt pour générer un vrai hash:');
  console.log('   npm install bcrypt');
  console.log('   puis modifiez ce fichier pour utiliser:');
  console.log('   const bcrypt = require("bcrypt");');
  console.log('   const hash = await bcrypt.hash(password, 10);');
  console.log('\n📋 Pour l\'instant, utilisez un générateur en ligne:');
  console.log('   https://bcrypt-generator.com/');
  console.log('\n🔐 Mot de passe à hasher:', password);
  console.log('   Rounds: 10');
}

// Récupérer le mot de passe depuis les arguments
const password = process.argv[2];

if (!password) {
  console.log('\n❌ Usage: node generate-password-hash.js [motdepasse]');
  console.log('\nExemple: node generate-password-hash.js test123\n');
  
  // Mode interactif
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question('🔑 Entrez le mot de passe à hasher: ', (answer) => {
    generateHash(answer).then(() => {
      rl.close();
    });
  });
} else {
  generateHash(password);
}

// ============================================
// EXEMPLE D'UTILISATION AVEC BCRYPT INSTALLÉ
// ============================================
/*
const bcrypt = require('bcrypt');

async function hashPassword(password) {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  
  console.log('\n✅ Hash généré avec succès!');
  console.log('\n📋 Hash à copier dans la BDD:');
  console.log(hash);
  console.log('\n📝 Requête SQL:');
  console.log(`UPDATE users SET password_hash = '${hash}' WHERE username = 'testpilot';`);
  console.log('\n🔐 Pour tester:');
  console.log(`Mot de passe: ${password}`);
  console.log(`Hash: ${hash}`);
  
  return hash;
}

// Exemple de vérification
async function verifyPassword(password, hash) {
  const match = await bcrypt.compare(password, hash);
  console.log('\n✅ Vérification:', match ? 'Mot de passe correct ✓' : 'Mot de passe incorrect ✗');
  return match;
}
*/
