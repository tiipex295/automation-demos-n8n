# Validation du workflow de réception et de reprise

**Validation réalisée le 18 novembre 2026 dans n8n 2.48.5, avec Node.js 24.22.3.** Deux exécutions locales indépendantes ont réussi. Chacune a produit les sept résultats attendus, avec trois écritures et trois notifications simulées au total.

Le [workflow testé](../workflows/intake-retry-demo.json) reçoit des demandes fictives, simule leur inscription dans une table et leur notification, puis vérifie sept scénarios. Il comporte un déclencheur manuel et un nœud Code.

## Preuve d’exécution

Le JSON a été importé sans modification dans une instance n8n locale dédiée, avec une base neuve. Le nœud Code a été exécuté par le runner JavaScript interne de n8n. Les deux nœuds portent le statut `success`, avec un résultat global `status: "success"` et `finished: true`.

La [preuve JSON publiable](../evidence/intake-retry-n8n-2026-11-18.json) contient les versions, les résultats des sept scénarios et les compteurs. Elle enregistre la dernière exécution à 19 h 04 UTC, soit 20 h 04 à Paris le 18 novembre 2026. L’empreinte du workflow importé est `30301df2bf70d8a116e17fa90b9280e9a763fb1a99247e1d9b77f3a97021eb56` en SHA-256.

## Reproduire l’exécution

Avec n8n installé et configuré dans un environnement local dédié, placez-vous à la racine du dépôt. Importez le workflow et relevez son identifiant local.

```sh
n8n import:workflow --input=workflows/intake-retry-demo.json
n8n list:workflow --onlyId
```

Remplacez `ID_DU_WORKFLOW_IMPORTE` par l’identifiant obtenu, puis exécutez le workflow.

```sh
n8n execute --id="ID_DU_WORKFLOW_IMPORTE" --rawOutput
```

Les identifiants et la configuration de l’instance de validation restent locaux. Chaque nouvelle exécution du workflow réinitialise ses données de simulation.

## Résultats observés et conformes aux attentes

Les lignes et notifications sont cumulées au fil d’une même exécution. Les deux exécutions ont donné cette séquence.

| Scénario | Statut simulé observé | Lignes cumulées | Notifications cumulées |
| --- | --- | --- | --- |
| Nouvelle demande | 201 | 1 | 1 |
| Rejeu exact de la demande | 200 | 1 | 1 |
| Table indisponible | 503 | 1 | 1 |
| Reprise explicite après rétablissement de la table | 201 | 2 | 2 |
| Notification indisponible | 503 | 3 | 2 |
| Reprise explicite de la seule notification | 201 | 3 | 3 |
| Identifiant réutilisé avec des données différentes | 409 | 3 | 3 |

Chaque élément porte `simulated: true` et `passed: true`. Les compteurs finaux sont `sheet_rows: 3`, `notifications: 3`, `simulated_row_writes: 3` et `simulated_notification_sends: 3`. Les compteurs d’effets permettent de détecter une réécriture qui laisserait inchangée la taille d’une Map.

## Interpréter le résultat n8n

Une exécution n8n marquée `success` signifie que le nœud a terminé et que ses assertions ont réussi. Les valeurs `status: 503` figurent volontairement dans les données pour représenter les échecs simulés de table et de notification. De même, `409` représente le conflit de données attendu. Ces valeurs peuvent donc accompagner une exécution globale réussie. Une assertion non satisfaite déclenche une erreur dans le nœud Code.

## Portée de la démonstration

Le stockage, les notifications et l’état de traitement utilisent des Maps en mémoire, réinitialisées à chaque exécution. Les scénarios se suivent dans un même nœud Code. Les reprises sont déclenchées explicitement par les cas de test. Le workflow utilise des données fictives et effectue son traitement sans requête réseau.

Les essais portent sur les transitions de traitement et les effets simulés. La persistance entre exécutions, la concurrence, les reprises planifiées et les intégrations réelles demandent une implémentation et une recette distinctes. Une livraison de notification incertaine après un délai réseau demanderait également une vérification avant reprise.

Le [test Node.js reproductible](../tests/intake-retry.test.cjs) et la [notice d’utilisation](intake-retry.md) complètent cette note.
