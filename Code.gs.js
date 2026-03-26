/**
 * GESTION DE PARC AUTOMOBILE - GOOGLE APPS SCRIPT
 * Version: 1.0.0
 * GitHub Repository: [VOTRE_LIEN_ICI]
 * * DESCRIPTION:
 * Ce script automatise la surveillance d'une flotte de véhicules.
 * Il vérifie les dates d'expiration (Assurance, Contrôle Technique)
 * et le seuil de kilométrage pour la vidange.
 */

// CONFIGURATION : Remplacez par votre email de gestionnaire
const CONFIG = {
  EMAIL_GESTIONNAIRE: "votre-email@exemple.com", 
  NOM_FEUILLE_PARC: "Parc_Auto",
  SEUIL_ALERTE_JOURS: 7,
  SEUIL_ALERTE_KM: 500 // Alerte 500 km avant la vidange
};

/**
 * Fonction principale : Vérifie l'état de la flotte
 */
function executerControleFlotte() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.NOM_FEUILLE_PARC);
  
  if (!sheet) {
    Logger.log("Erreur : La feuille '" + CONFIG.NOM_FEUILLE_PARC + "' est introuvable.");
    return;
  }

  const data = sheet.getDataRange().getValues();
  const aujourdhui = new Date();
  let listeAlertes = [];

  // On commence à i = 1 pour ignorer la ligne d'en-tête
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    
    // MAPPING DES COLONNES (À ajuster selon votre tableau)
    const vehicule = {
      immat:      row[1], // Col B
      modele:     row[3], // Col D
      kmVidange:  row[6], // Col G (Objectif km)
      assurance:  new Date(row[7]), // Col H (Date expiration)
      kmActuel:   row[8]  // Col I (Dernier relevé)
    };

    // 1. VÉRIFICATION DES DATES (Assurance / Contrôle Technique)
    const diffTemps = vehicule.assurance.getTime() - aujourdhui.getTime();
    const joursRestants = Math.ceil(diffTemps / (1000 * 3600 * 24));

    if (joursRestants <= CONFIG.SEUIL_ALERTE_JOURS) {
      const msgDate = joursRestants < 0 
        ? `🔴 EXPIRE depuis ${Math.abs(joursRestants)} jours` 
        : `⚠️ EXPIRE dans ${joursRestants} jours`;
      listeAlertes.push(`[${vehicule.immat}] - Assurance : ${msgDate}`);
    }

    // 2. VÉRIFICATION DU KILOMÉTRAGE (Vidange)
    if (vehicule.kmActuel >= (vehicule.kmVidange - CONFIG.SEUIL_ALERTE_KM)) {
      const resteKm = vehicule.kmVidange - vehicule.kmActuel;
      const msgKm = resteKm <= 0 
        ? `🔴 DÉPASSÉE de ${Math.abs(resteKm)} km` 
        : `⚠️ À PRÉVOIR (Reste ${resteKm} km)`;
      listeAlertes.push(`[${vehicule.immat}] - Vidange : ${msgKm}`);
    }
  }

  // ENVOI DU RAPPORT SI NÉCESSAIRE
  if (listeAlertes.length > 0) {
    envoyerRapportEmail(listeAlertes);
  }
}

/**
 * Envoie le rapport formaté par email
 */
function envoyerRapportEmail(alertes) {
  const corps = "Bonjour,\n\n" +
                "Le système de gestion de parc a détecté les anomalies suivantes :\n\n" +
                alertes.join("\n") + 
                "\n\nMerci de prendre les dispositions nécessaires.\n" +
                "--\nAutomate de Gestion Auto.";

  MailApp.sendEmail({
    to: CONFIG.EMAIL_GESTIONNAIRE,
    subject: "🚨 ALERTE FLOTTE AUTO - " + Utilities.formatDate(new Date(), "GMT+1", "dd/MM/yyyy"),
    body: corps
  });
}

/**
 * Ajoute un bouton dans le menu Google Sheets
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('⚙️ Gestion Auto')
      .addItem('Lancer le contrôle manuel', 'executerControleFlotte')
      .addToUi();
}
