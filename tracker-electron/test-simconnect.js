// Test rapide de connexion SimConnect
const { open, Protocol } = require('node-simconnect');

console.log('🔍 Test de connexion à MSFS...\n');

open('Test FlyNova', Protocol.FSX_SP2)
  .then(({ recvOpen, handle }) => {
    console.log('✅ CONNEXION RÉUSSIE !');
    console.log('📋 Application:', recvOpen.applicationName);
    console.log('📋 Version:', recvOpen.applicationVersionMajor + '.' + recvOpen.applicationVersionMinor);
    console.log('📋 Build:', recvOpen.applicationBuildMajor + '.' + recvOpen.applicationBuildMinor);
    console.log('📋 SimConnect Version:', recvOpen.simConnectVersionMajor + '.' + recvOpen.simConnectVersionMinor);
    console.log('\n✅ MSFS est bien détecté et accessible !');
    
    // Clean exit
    setTimeout(() => {
      console.log('\n👋 Test terminé, fermeture...');
      process.exit(0);
    }, 2000);
  })
  .catch((error) => {
    console.error('❌ ÉCHEC DE CONNEXION');
    console.error('📋 Erreur:', error.message);
    console.error('\n⚠️ Vérifications nécessaires :');
    console.error('   1. MSFS 2020 est-il lancé ?');
    console.error('   2. Êtes-vous EN VOL (pas au menu) ?');
    console.error('   3. Le chargement est-il terminé ?');
    console.error('   4. SimConnect est-il installé ?');
    process.exit(1);
  });
