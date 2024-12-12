# MARVIZ

Marviz est une visualisation interactive des films Marvel, mettant en avant la chronologie ainsi que les performances au box-office de l'univers cinématographique Marvel (MCU).

## 🎯 Fonctionnalités

- **Visualisation chronologique** : Un graphique interactif montrant l'ordre de visionnage recommandé des films Marvel
- **Box-office** : Une visualisation élégante des performances financières de chaque film sous forme d'arcs
- **Interactivité** :
 - Survol des arcs pour voir les détails (box-office, année de sortie, affiche)
 - Clic pour regarder la bande-annonce du film
 - Animations fluides lors de l'apparition des graphiques

## 📊 Audit d'accessibilité
[Rapport complet de l'audit](https://ara.numerique.gouv.fr/rapports/bk39LYgQKAM_a83ilon9e)

## 🛠 Technologies utilisées

- HTML5 Canvas pour les visualisations
- D3.js pour la manipulation des données et les animations
- Javascript vanilla pour l'interactivité
- CSS moderne avec animations et transitions
- Police personnalisée Satoshi pour le design

## 📁 Structure du projet
marviz/
   assets/
       fonts/
           Satoshi/
       images/
   css/
       style.css  
   js/
       box-office.js
       chronologie.js 
   data/
       marvelData.json
   index.html

## 💻 Installation

```bash
git clone https://github.com/Aryann94/Marviz.git
```

⚙️ Configuration
Le fichier marvelData.json contient toutes les données des films Marvel avec :

Titre du film
Année de sortie
Box-office
Année dans l'univers Marvel
URL de l'affiche
URL de la bande-annonce

🎨 Personnalisation

Modifiez les couleurs dans le CSS
Ajustez les dimensions des graphiques dans les fichiers JS
Personnalisez les animations en modifiant les paramètres d'easing

👥 Contribution
Les contributions sont les bienvenues ! N'hésitez pas à :

Fork le projet
Créer une branche pour votre fonctionnalité
Commit vos changements
Push sur la branche
Ouvrir une Pull Request

📝 Licence
Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.
🙏 Remerciements

Marvel Studios pour l'univers cinématographique
La communauté D3.js pour les exemples et l'inspiration
Fontshare pour la police Satoshi
