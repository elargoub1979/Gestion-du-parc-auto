/**
 * 🚗 APPLICATION GESTIONNAIRE AUTO SOLO (v1.1)
 * --------------------------------------------
 * Ce script centralise :
 * 1. La mise à jour automatique du kilométrage (via Formulaire).
 * 2. L'alerte automatique par email (Assurance & Vidange).
 * 3. Le calcul automatique des jours restants.
 */

const CONFIG = {
  EMAIL_GESTIONNAIRE: "votre-email@exemple.com", // 📧 À modifier
  NOM_FEUILLE_PARC: "Parc_Auto",
  NOM_FEUILLE_REPONSES: "Réponses au formulaire 1", // Nom de l'onglet de saisie
  SEUIL_ALERTE_JOURS: 10,
  SEUIL_ALERTE_KM: 500
};

/**
 * 1. MISE À JOUR AUTOMATIQUE DU KM (DÉCLENCHEUR : À L'ENVOI DU FORMULAIRE)
 * Permet de mettre à jour l'onglet "Parc_Auto" dès que vous remplissez votre formulaire.
 */
function mettreAJourKmAuto(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetParc = ss.getSheetByName(CONFIG.NOM_FEUILLE_PARC);
  
  // Récupération des données saisies (Ajustez les index [1], [2] selon votre formulaire)
  const immatSaisie = e.values[1]; // L'immatriculation choisie
  const kmSaisi = parseInt(e.values[2]); // Le kilométrage saisi
  
  if (isNaN(kmSaisi)) return;

  const dataParc = sheetParc.getDataRange().getValues();
  
  // Recherche du véhicule dans la colonne B (index 1) pour mettre à jour la colonne I (index 8)
  for (let i = 1; i < dataParc.length; i++) {
    if (dataParc[i][1].toString().trim() === immatSaisie.toString().trim()) {
      sheetParc.getRange(i + 1, 9).setValue(kmSaisi); 
      Logger.log("Mise à jour réussie pour : " + immatSaisie);
      break;
    }
  }
}

/**
 * 2. SURVEILLANCE DES ÉCHÉANCES (DÉCLENCHEUR : QUOTIDIEN)
 * Parcourt votre parc et vous liste ce qui demande votre attention.
 */
function verifierAlertesQuotidiennes() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.NOM_FEUILLE_PARC);
  const data = sheet.getDataRange().getValues();
  const aujourdhui = new Date();
  let rapport = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const vehicule = {
      immat: row[1],      // Col B
      nom: row[2] + " " + row[3], // Marque + Modèle
      kmVidange: row[6],  // Col G
      assurance: new Date(row[7]), // Col H
      kmActuel: row[8]    // Col I
    };

    // --- Check Assurance ---
    const joursRestants = Math.ceil((vehicule.assurance - aujourdhui) / (1000 * 60 * 60 * 24));
    if (joursRestants <= CONFIG.SEUIL_ALERTE_JOURS) {
      const etat = joursRestants < 0 ? "❌ EXPIRÉ" : `⚠️ Expire dans ${joursRestants}j`;
      rapport.push(`${etat} : Assurance ${vehicule.immat} (${vehicule.nom})`);
    }

    // --- Check Vidange ---
    const resteKm = vehicule.kmVidange - vehicule.kmActuel;
    if (resteKm <= CONFIG.SEUIL_ALERTE_KM) {
      const etatKm = resteKm <= 0 ? "❌ VIDANGE DÉPASSÉE" : `🔧 Prévoir vidange (${resteKm} km restants)`;
      rapport.push(`${etatKm} : ${vehicule.immat}`);
    }
  }

  if (rapport.length > 0) {
    MailApp.sendEmail({
      to: CONFIG.EMAIL_GESTIONNAIRE,
      subject: "📋 Rapport de Gestion Auto - " + Utilities.formatDate(aujourdhui, "GMT+1", "dd/MM/yyyy"),
      body: "Bonjour,\n\nVoici l'état de votre parc ce matin :\n\n- " + rapport.join("\n- ") + "\n\nBonne journée."
    });
  }
}

/**
 * 3. INITIALISATION DU MENU
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🛠️ Ma Gestion Auto')
      .addItem('Lancer le contrôle maintenant', 'verifierAlertesQuotidiennes')
      .addToUi();
}
