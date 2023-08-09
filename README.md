# VirtualTrader_Server

## Description

VirtualTrader_Server est la partie back-end du projet VirtualTrader. Il gère les données, crée les utilisateurs, les portefeuilles, récupère les données sur les courbes des prix, et gère les transactions virtuelles entre USD et cryptomonnaies. Ce projet utilise Node.js et MySQL et fait partie d'une démonstration de compétences pour des futurs intéressés.

## Technologies Utilisées

- **Node.js** : Utilisé pour la gestion du serveur et l'exécution du code JavaScript côté serveur.
- **MySQL** : Utilisé comme système de gestion de base de données.

## Structure de la Base de Données

### Table des Utilisateurs (users)

- user_id: INT, clé primaire, auto-incrément
- username: VARCHAR
- email: VARCHAR
- password_hash: VARCHAR
- created_at: TIMESTAMP

### Table des Portefeuilles (portfolios)

- portfolio_id: INT, clé primaire, auto-incrément
- user_id: INT, clé étrangère vers users
- balance: DECIMAL
- created_at: TIMESTAMP

### Table des Actions (stocks)

- stock_id: INT, clé primaire, auto-incrément
- symbol: VARCHAR
- name: VARCHAR
- last_price: DECIMAL

### Table des Positions du Portefeuille (portfolio_positions)

- position_id: INT, clé primaire, auto-incrément
- portfolio_id: INT, clé étrangère vers portfolios
- stock_id: INT, clé étrangère vers stocks
- quantity: INT

### Table des Transactions (transactions)

- transaction_id: INT, clé primaire, auto-incrément
- portfolio_id: INT, clé étrangère vers portfolios
- stock_id: INT, clé étrangère vers stocks
- type: ENUM ('buy', 'sell')
- quantity: INT
- price: DECIMAL
- timestamp: TIMESTAMP

## Configuration

### Fichier de Configuration

Le fichier `.env` doit être placé dans le dossier `src`. Voici un exemple de configuration:

```env
APP_NAME="VirtualTrader"
DOMAIN_NAME=http://localhost:3000

PORT=PORT
JWT_SECRET=

DB_HOST=VotreHôte
DB_USER=VotreUtilisateur
DB_PASS=VotreMotDePasse
DB_NAME=NomDeLaBaseDeDonnées

SMTP_HOST=SMTPHôte
SMTP_USER=SMTPUser
SMTP_PASS=SMTPPass
```

## Installation

1. **Cloner le répertoire**: `git clone https://github.com/VirtualTrader-Blizz/VirtualTrader_Server`
2. **Installer les dépendances**: `npm install`
3. **Lancer le projet**: `node ./src/index.js`

## Contact

Pour toute question ou support, vous pouvez me contacter par email à [theowincke@live.fr](mailto:theowincke@live.fr) ou sur Discord à \`blizzfull\`.
