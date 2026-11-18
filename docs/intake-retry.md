# Réception d’une demande et reprise après échec

**Sept scénarios simulés de reprise séquentielle en mémoire, dans une seule exécution.** Une demande fictive est validée, inscrite dans une table simulée, puis ajoutée à une destination de notification simulée. Un nouvel essai explicite reprend le traitement après un échec partiel.

## Essayer dans n8n

1. Importez [intake-retry-demo.json](../workflows/intake-retry-demo.json) dans un nouveau workflow.
2. Lancez le workflow manuellement et ouvrez le nœud « Simulate request intake and verify outcomes ».
3. La sortie attendue contient sept éléments avec `simulated: true` et `passed: true`.

Le fichier contient un déclencheur manuel et un nœud Code. Il reste inactif à l’import et utilise des adresses fictives en `example.invalid`.

| Scénario simulé | Résultat attendu |
| --- | --- |
| Nouvelle demande | Statut 201, une ligne et une notification |
| Rejeu exact | Statut 200, aucun effet supplémentaire |
| Table indisponible | Statut 503, aucune ligne ni notification pour cette demande |
| Nouvel essai explicite après rétablissement de la table | Statut 201, une ligne et une notification pour cette demande |
| Notification indisponible | Statut 503, la ligne reste enregistrée |
| Nouvel essai explicite après rétablissement de la notification | Statut 201, seule la notification est ajoutée |
| Même identifiant avec des données modifiées | Statut 409, compteurs inchangés |

Les assertions contrôlent les résultats, le nombre d’enregistrements et les compteurs cumulés d’écritures et de notifications. Le bilan est de trois lignes, trois notifications, trois écritures et trois envois simulés. Un résultat inattendu déclenche une erreur.

## Reproduire le test avec Node.js

Avec Node.js installé, exécutez cette commande depuis la racine du dépôt.

```sh
node tests/intake-retry.test.cjs
```

Le [script de test](../tests/intake-retry.test.cjs) charge le JSON du dépôt, exécute le Code et compte les écritures simulées dans les Maps. Il utilise uniquement les modules intégrés de Node.js. La sortie attendue confirme sept scénarios réussis, trois écritures et trois notifications.

## Vérifications du 18 novembre 2026

Le JavaScript du nœud Code a été exécuté dans une VM Node.js isolée. Les sept scénarios intégrés ont réussi. Une instrumentation indépendante des Maps a compté trois écritures et trois notifications. Une régression introduite volontairement, qui réécrivait la ligne lors de la reprise d’une notification, a fait échouer l’assertion.

Douze vérifications d’audit supplémentaires ont réussi sur les champs obligatoires invalides, les espaces, les conflits de données et les échecs répétés de notification. Ces contrôles ont été exécutés séparément des sept scénarios inclus dans le workflow. Cette copie JSON a fait l’objet d’un contrôle de structure. Son import et son exécution dans une instance n8n restent à essayer.

## Portée

Les adaptateurs utilisent des Maps JavaScript réinitialisées au début de chaque exécution. Les reprises sont des appels explicites dans la liste des scénarios. Les valeurs `status` représentent des résultats simulés. Le workflow fonctionne sans nœud de réponse HTTP ni service externe.

La persistance entre exécutions, les demandes concurrentes, l’authentification, les délais réseau, les intégrations réelles et la planification des reprises demandent une implémentation et des tests dédiés. Un pilote réel doit conserver un identifiant stable, un état de traitement persistant et des mises à jour conditionnelles ou atomiques. Un envoi dont la réussite reste incertaine demande une vérification ou une revue avant reprise.

[Retour au dépôt](../README.md)
