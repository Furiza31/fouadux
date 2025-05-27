# MailCollab - Boîte Mail Collaborative

Projet réalisé par **Hugo**, **Fouad** et **Charles** dans le cadre du module de Développement Web à l'EFREI.

---

## Présentation

MailCollab est une application web de gestion de boîte mail collaborative. Elle permet à plusieurs utilisateurs de gérer, consulter et organiser des emails de manière centralisée et sécurisée.

---

## Stack technique

- **Frontend** : Vue 3, TypeScript, Vite, Tailwind CSS, Pinia, Vue Router
- **Backend** : Express.js, TypeScript, Prisma ORM
- **Base de données** : SQLite (via Prisma)
- **Authentification** : JWT, WebAuthn, providers externes (Google, Microsoft, etc.)

---

## Structure du projet

- `app/` : Frontend (Vue 3)
- `api/` : Backend (Express + Prisma)

---

## Lancer le projet

### 1. Prérequis
- Node.js >= 18
- npm >= 9

### 2. Cloner le dépôt

**URL du dépôt GitHub :** [https://github.com/Furiza31/fouadux.git](https://github.com/Furiza31/fouadux.git)

```bash
git clone https://github.com/Furiza31/fouadux.git
cd fouadux/project
```

### 3. Installation des dépendances
#### Backend
```bash
cd api
npm install
```
#### Frontend
```bash
cd ../app
npm install
```

### 4. Configuration des variables d'environnement (Backend)
Dans le dossier `api/`, créez un fichier `.env` à partir des informations suivantes :

```
PORT=3000
JWT_SECRET=<votre_secret>
JWT_EXPIRATION=1d
DATABASE_URL="file:./dev.db"
SALT_ROUNDS=10
```
Pour générer un secret sécurisé :
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 5. Initialisation de la base de données
Dans le dossier `api/` :
```bash
npm run prisma:setup
```

### 6. Lancer le backend
Toujours dans `api/` :
```bash
npm run dev
```

### 7. Lancer le frontend
Dans un autre terminal, dans `app/` :
```bash
npm run dev
```

Le frontend sera accessible par défaut sur [http://localhost:5173](http://localhost:5173) et l'API sur [http://localhost:3000](http://localhost:3000).

---

## Modèles principaux (Prisma)

- **User** : Utilisateur de la plateforme
- **Account** : Comptes liés (Google, Microsoft, etc.)
- **Session** : Sessions utilisateur
- **VerificationToken** : Gestion des tokens de vérification
- **Authenticator** : Authentification forte (WebAuthn)

---

## Scripts utiles

### Backend (`api/`)
- `npm run dev` : Lancer le serveur en développement
- `npm run build` : Compiler le projet
- `npm start` : Lancer le serveur compilé
- `npm run prisma:studio` : Ouvrir Prisma Studio (visualisation DB)

### Frontend (`app/`)
- `npm run dev` : Lancer le serveur de développement
- `npm run build` : Build de production
- `npm run preview` : Prévisualiser le build

---

## Auteurs
- Hugo
- Fouad
- Charles

---

**Dépôt GitHub du projet :** [https://github.com/Furiza31/fouadux.git](https://github.com/Furiza31/fouadux.git)
