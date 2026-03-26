# 🔧 Guide d'Activation - Gestion de Parc Solo

Une fois le code copié dans Google Apps Script, suivez ces étapes pour que l'application soit 100% autonome.

## 1. Activation des Automatismes (Déclencheurs)
Dans l'éditeur Apps Script, cliquez sur l'icône **Réveil** (Déclencheurs) à gauche :

### A. Mise à jour automatique (Formulaire)
- **Fonction :** `mettreAJourKmAuto`
- **Source :** "De la feuille de calcul"
- **Événement :** "Lors de l'envoi du formulaire"
*Ceci permet de mettre à jour votre inventaire dès que vous validez une saisie sur mobile.*

### B. Rapport Quotidien (Email)
- **Fonction :** `verifierAlertesQuotidiennes`
- **Source :** "Selon le temps"
- **Type :** "Minuteur quotidien" (choisir 08h - 09h)
*Ceci vous envoie un mail chaque matin si une assurance expire ou si une vidange est due.*

## 2. Structure de la Feuille Google Sheets
Le script lit les données selon cet ordre précis :
- **Colonne B (index 1) :** Immatriculation (ex: AA-123-BB)
- **Colonne G (index 6) :** Kilométrage cible Vidange
- **Colonne H (index 7) :** Date Échéance Assurance
- **Colonne I (index 8) :** Kilométrage Actuel (mis à jour par le script)

## 3. Liaison avec Google Forms
1. Créez un formulaire avec : `Immatriculation` (Liste) et `Kilométrage` (Nombre).
2. Liez le formulaire à votre Google Sheets (onglet "Réponses au formulaire 1").
