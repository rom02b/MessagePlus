# Cahier des Charges - MessagePlus

## 1. Présentation du Projet
**MessagePlus** est une application web et mobile conçue pour créer et gérer des parcours d'engagement spirituel (dévotions, études bibliques, méditations). L'application permet de générer automatiquement des parcours thématiques sur plusieurs jours grâce à l'Intelligence Artificielle, en s'adaptant à des confessions religieuses spécifiques, à une durée définie, et à un ton particulier.

## 2. Objectifs de l'Application
- **Automatisation de la création de contenu :** Faciliter la création de campagnes spirituelles pour les créateurs de contenu, les pasteurs, ou les utilisateurs individuels grâce à l'IA.
- **Accessibilité multiplateforme :** Offrir une expérience fluide sur le web, ainsi que sur mobile (iOS et Android).
- **Simplicité d'accès :** Proposer une connexion sans mot de passe (Magic Link) pour réduire les frictions à l'entrée.
- **Partage et Engagement :** Permettre le partage facile des parcours générés avec une communauté ou des amis.

## 3. Public Cible
- Croyants souhaitant un plan d'étude ou de méditation personnalisé.
- Créateurs de contenu religieux souhaitant générer des plans de lecture pour leur audience.
- Églises et communautés souhaitant fournir des ressources spirituelles quotidiennes à leurs membres.

## 4. Fonctionnalités Principales

### 4.1. Génération de Parcours (Campagnes)
- **Paramétrage de la campagne :** Choix de la confession, de la durée (en jours), du ton, et ajout d'options de contenu (nom de l'orateur, citations spécifiques, etc.).
- **Génération via l'IA :** Utilisation de Google Generative AI (Gemini) pour générer le contenu détaillé pour chaque jour (titre, versets, méditation, prière, etc.).
- **Génération depuis YouTube :** Capacité d'extraire la transcription d'une vidéo YouTube pour générer un parcours spirituel basé sur le contenu d'une prédication ou d'un enseignement.

### 4.2. Gestion des Campagnes
- **Historique :** Sauvegarde des campagnes générées dans l'espace utilisateur.
- **Consultation :** Visualisation jour par jour du contenu généré.
- **Suppression :** Possibilité pour l'utilisateur de supprimer ses anciennes campagnes.

### 4.3. Partage
- Génération d'un lien public permettant à des utilisateurs non authentifiés ou tiers de consulter un parcours spécifique.

### 4.4. Authentification
- Connexion sécurisée sans mot de passe (Passwordless) par "Magic Link" envoyé par e-mail.

---

## 5. Architecture et Stack Technique

### 5.1. Frontend (Interface Utilisateur)
- **Framework Web :** React.js avec Vite.
- **Application Mobile :** Capacitor (permet de compiler l'application web en applications natives iOS et Android).
- **Langage :** TypeScript.

### 5.2. Backend (API & Logique Métier)
- **Environnement :** Cloudflare Pages Functions (Serverless).
- **Authentification :** Better Auth (implémentation du plugin Magic Link).
- **Service d'E-mail :** Brevo API (pour l'envoi des liens magiques).
- **Intelligence Artificielle :** Google Generative AI (Gemini SDK).

### 5.3. Base de Données
- **SGBD :** PostgreSQL serverless hébergé sur **Neon.tech**.
- **ORM :** Drizzle ORM (pour interagir avec la base de données de manière typée et sécurisée).

---

## 6. Modèle de Données (Schéma de la Base de Données)

L'application repose sur deux grands groupes de tables : l'authentification et les données métier.

### 6.1. Tables d'Authentification (Better Auth)
- **`user`** : Stocke les informations des utilisateurs (ID, nom, email, email vérifié, date de création).
- **`session`** : Gère les sessions actives (token, expiration, adresse IP, user agent).
- **`account`** : Gère les comptes liés si d'autres fournisseurs OAuth sont ajoutés dans le futur.
- **`verification`** : Stocke les tokens temporaires (ex: Magic Links) avec leur date d'expiration.

### 6.2. Table Métier
- **`campaigns`** : Stocke les parcours générés.
  - `id` : Identifiant unique (UUID).
  - `userId` : Référence à l'utilisateur créateur.
  - `title` : Titre du parcours.
  - `confession` : Courant spirituel ou dénomination.
  - `duration` : Nombre de jours.
  - `tone` : Ton du contenu (ex: encourageant, pastoral, académique).
  - `contentOptions` : Paramètres additionnels (JSON).
  - `speakerName` : Nom de l'orateur (si basé sur un enseignement).
  - `days` : Contenu généré pour chaque jour (JSON structuré).
  - `quotes` : Citations extraites ou fournies (JSON).
  - `createdAt` : Date de création.

---

## 7. Sécurité et Authentification
- L'authentification est déléguée à Better Auth qui gère la sécurité des sessions et l'invalidation des tokens.
- L'API backend vérifie systématiquement la validité du token Bearer ou du cookie de session avant d'autoriser l'accès aux routes privées (ex: `GET /api/campaigns`, `DELETE /api/campaigns`).
- Les requêtes Cross-Origin (CORS) sont configurées pour accepter les requêtes provenant de l'application web Cloudflare et de l'application mobile (`capacitor://localhost`).

---

## 8. Déploiement et Hébergement
- **Frontend & Backend Serverless :** Déployés conjointement sur **Cloudflare Pages**.
- **Base de données :** Hébergée sur **Neon.tech**.
- **CI/CD :** Déploiement continu configuré via GitHub. Chaque "push" sur la branche principale déclenche un nouveau build et déploiement sur Cloudflare Pages.
