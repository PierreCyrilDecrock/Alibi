# Alibi — application web installable (PWA)

Un jeu de logique criminelle : des cartes générées à l'infini, un coupable unique à
démasquer. Une seule page (`index.html`), aucune dépendance, fonctionne hors ligne une
fois ouverte une première fois.

## Contenu

| Fichier | Rôle |
|---|---|
| `index.html` | Tout le jeu (moteur, interface, dessins, animations) |
| `manifest.webmanifest` | Nom, icônes et couleurs de l'application installée |
| `sw.js` | Service worker : cache pour le mode hors ligne |
| `icons/` | Icônes 192/512 px, icône « maskable » Android, icône iOS, icône SVG |
| `.nojekyll` | Indique à GitHub Pages de servir les fichiers tels quels |

## Publier sur GitHub Pages

1. Créez un dépôt GitHub (par exemple `alibi`) et déposez-y **le contenu** de ce dossier
   à la racine (`index.html` doit être à la racine du dépôt). `.nojekyll` est un fichier
   caché : vérifiez qu'il est bien envoyé.
2. Dans le dépôt : **Settings → Pages**.
3. *Build and deployment* : **Deploy from a branch**, branche `main`, dossier `/ (root)`, puis **Save**.
4. Après une ou deux minutes, le jeu est en ligne à l'adresse
   `https://<votre-pseudo>.github.io/alibi/`.

Les chemins sont tous relatifs : cela fonctionne aussi bien dans un sous-dossier
(`/alibi/`) qu'avec un nom de domaine personnalisé.

## Installer sur un téléphone

- **Android (Chrome)** : menu ⋮ → *Installer l'application* (ou *Ajouter à l'écran d'accueil*).
- **iPhone / iPad (Safari)** : bouton Partager → *Sur l'écran d'accueil*.
- **Ordinateur (Chrome, Edge)** : icône d'installation à droite de la barre d'adresse.

L'installation exige une adresse en **https** (GitHub Pages l'est d'office).

## Mettre à jour

Après avoir modifié `index.html`, ouvrez `sw.js` et changez `VERSION`
(`alibi-1` → `alibi-2`, etc.), puis envoyez le tout sur GitHub. Les appareils déjà
installés récupèrent la nouvelle version au lancement suivant (parfois au deuxième :
la page s'affiche d'abord depuis le cache, puis se met à jour en arrière-plan).

## Tester en local

```
cd alibi
python3 -m http.server 8080
```

Puis ouvrez <http://localhost:8080>. (Le service worker ne fonctionne pas en ouvrant
le fichier directement avec `file://`, mais le jeu, lui, marche.)

## Données

Les parties, réglages et statistiques sont enregistrés dans le navigateur de
l'appareil (`localStorage`). Rien n'est envoyé à un serveur. Seule exception : les
polices sont chargées depuis Google Fonts (puis mises en cache pour le hors ligne) ;
sans elles, le jeu s'affiche avec des polices système.
