# Automatiser les demandes de devis et le contrôle de catalogue

**Cédric Plessis** — démonstrations personnelles d’automatisation avec n8n et JavaScript, sur des données fictives.

Ce dépôt montre comment contrôler une demande, signaler les informations manquantes ou répétées et préparer un brouillon pour relecture. Une seconde maquette applique une validation ligne par ligne à un petit catalogue produit.

| Demandes de devis | Catalogue produit |
| --- | --- |
| Message fictif, champs manquants, brouillon modifiable et validation avant impression PDF. [Essayer en ligne](https://demo-devis-atelier-cedric.plessiscedric.chatgpt.site/) · [Fichier HTML](demos/devis.html) | Quatre produits, SKU en double, prix manquant, validation et export CSV. [Fichier HTML](demos/catalogue.html) |

[Consulter mon profil LinkedIn](https://www.linkedin.com/in/c%C3%A9dric-plessis-a1318a44b/)

## Essayer les fichiers

Téléchargez le dépôt, puis ouvrez les fichiers HTML localement dans un navigateur récent. Les [instructions détaillées](docs/usage.md) donnent les résultats attendus et les limites.

Le [workflow n8n de devis](workflows/devis-validation-demo.json) traite six demandes fictives avec normalisation, contrôle des données et dédoublonnage dans un même lot. Importez le JSON dans votre instance n8n et exécutez le workflow manuellement.

Le [workflow de réception et reprise](workflows/intake-retry-demo.json) simule sept scénarios en mémoire, dont un rejeu et deux échecs partiels suivis de reprises explicites. Sa [notice dédiée](docs/intake-retry.md) détaille les résultats attendus et les conditions nécessaires à une intégration réelle. Le [test local](tests/intake-retry.test.cjs) est reproductible avec Node.js depuis la racine du dépôt.

```sh
node tests/intake-retry.test.cjs
```

Un essai rapide dans la page devis donne **768 € TTC** pour deux portes de service, soit 640 € HT et 128 € de TVA fictive. Après validation, réanalysez la même demande pour voir le doublon signalé pendant la visite.

## Tests et limites

Le workflow source a été exécuté dans **n8n local 2.47.6 le 13 novembre 2026**. Les six cas ont donné **2 brouillons, 3 demandes à compléter et 1 doublon écarté**. Le 18 novembre, les mêmes blocs JavaScript ont aussi passé ces six cas dans Node.js. La logique de validation, de rejeu et d’export des pages a été vérifiée avec une simulation DOM locale.

Le second workflow a aussi été importé et exécuté avec succès dans **n8n 2.48.5, avec Node.js 24.22.3, le 18 novembre 2026**. Deux exécutions indépendantes ont terminé avec le statut `success`. Les sept scénarios ont réussi, avec trois écritures et trois notifications simulées au total par exécution. Aucune modification du workflow n’a été nécessaire. La [preuve de validation n8n](docs/validation-n8n.md) présente les résultats, les commandes et la sortie JSON vérifiée.

Les pages HTML et les workflows n8n s’essaient séparément. Le workflow de devis représente la revue humaine par un statut « en_attente ». La page devis propose le clic de validation et l’impression PDF.

Le dédoublonnage n8n dure une exécution, celui de la page devis une visite. L’extraction du message utilise des champs libellés. Les prix, la TVA et les descriptions produit sont des exemples prédéfinis. Ces démonstrations fonctionnent sans connexion à une messagerie, un CRM ou PrestaShop. Un raccordement réel demande des accès de test, un stockage persistant et une recette métier.

## English overview

Personal automation demos using fictional data. The n8n workflow checks six quote requests and returns two drafts for review, three incomplete requests and one duplicate skipped within the same run. The standalone HTML demos cover quote review and calculation, manual approval, catalogue checks and CSV export. A second workflow demonstrates seven simulated sequential recovery scenarios within one execution, with explicit retries and counters for simulated writes. It was imported and executed successfully twice in n8n 2.48.5 with Node.js 24.22.3 on 18 November 2026. All seven scenarios passed, with three simulated row writes and three simulated notifications per execution. See the [n8n validation report](docs/validation-n8n.md) and its recorded JSON output.

The source workflow ran successfully in local n8n on 13 November 2026. Its JavaScript was also tested locally on 18 November. These are independent demos with in-memory duplicate checks and predefined sample data. Connecting a real inbox, CRM or store would require a separately scoped integration and acceptance tests.
