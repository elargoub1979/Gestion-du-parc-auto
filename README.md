# 🚗 Gestionnaire de Parc Auto - Google Sheets & AppSheet

Ce projet permet de transformer un simple tableur Google Sheets en une application robuste de gestion de flotte automobile. Il automatise le suivi de la maintenance, les alertes d'assurance et le contrôle quotidien des véhicules.

## 🌟 Fonctionnalités
- **Inventaire Centralisé :** Suivi de l'état des véhicules, des modèles et des immatriculations.
- **Alertes Automatiques :** Notification par e-mail pour les vidanges proches et les assurances expirant sous 7 jours.
- **Suivi des Kilométrages :** Calcul automatique des distances parcourues.
- **Prêt pour le Mobile :** Compatible avec AppSheet pour une saisie sur le terrain (photos, signatures, scan QR Code).

## 🛠️ Installation

### 1. Préparation du Google Sheets
Créez un Google Sheets avec un onglet nommé **`Parc_Auto`**. Les colonnes doivent être organisées comme suit :

| Colonne | Titre | Description |
| :--- | :--- | :--- |
| **A** | ID | Identifiant unique du véhicule |
| **B** | Immatriculation | Plaque d'immatriculation |
| **C** | Marque | Constructeur |
| **D** | Modèle | Modèle du véhicule |
| **G** | Km Vidange | Le kilométrage cible pour la prochaine révision |
| **H** | Échéance Assurance | Date d'expiration (format JJ/MM/AAAA) |
| **I** | Km Actuel | Dernier kilométrage relevé |

### 2. Configuration du Script (Google Apps Script)
1. Dans votre Google Sheets, allez dans **Extensions** > **Apps Script**.
2. Copiez le contenu du fichier `Code.gs.js` présent dans ce dépôt GitHub.
3. Modifiez la variable `EMAIL_GESTIONNAIRE` au début du script avec votre adresse e-mail.
4. Cliquez sur **Enregistrer** (icône disquette).

### 3. Automatisation (Trigger)
Pour que les alertes soient envoyées automatiquement chaque matin :
1. Dans l'éditeur Apps Script, cliquez sur l'icône **Réveil** (Déclencheurs).
2. Cliquez sur **+ Ajouter un déclencheur**.
3. Choisissez la fonction `executerControleFlotte`.
4. Sélectionnez "Selon le temps" > "Minuteur quotidien".

## 📱 Utilisation avec AppSheet (Optionnel)
Pour transformer cet outil en application mobile :
1. Allez sur [AppSheet.com](https://www.appsheet.com).
2. Créez une nouvelle application à partir de votre feuille de calcul.
3. Ajoutez les vues de formulaires pour permettre aux agents de saisir les données de prise de service.

## 🛡️ Sécurité
- Ne partagez pas le lien de votre Google Sheets publiquement.
- Si vous utilisez ce script sur GitHub, assurez-vous de ne pas inclure de données sensibles (noms d'agents, e-mails personnels) dans le code source.

---
*Projet développé pour l'automatisation de la gestion de flotte automobile - 2026.*
