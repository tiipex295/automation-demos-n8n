# Essayer les démonstrations

Trois essais complémentaires sur des données fictives. Les deux pages HTML fonctionnent localement dans un navigateur récent, sans installation. Le workflow JSON s’importe dans une instance n8n dont vous disposez.

La [notice du second workflow](intake-retry.md) présente les scénarios de réception et de reprise après échec.

## Essayer les pages

1. Téléchargez les fichiers du dépôt et conservez leur arborescence dans un dossier.
2. Ouvrez [la démo devis](../demos/devis.html) et choisissez « Demande complète ».
3. Sélectionnez « Pose d’une porte de service » et une quantité de 2. Le calcul attendu est de 640 € HT, 128 € de TVA fictive et **768 € TTC**.
4. Relisez le brouillon, cliquez sur « Valider le devis », puis « Enregistrer en PDF ». Dans la fenêtre d’impression, choisissez l’enregistrement au format PDF.
5. Cliquez à nouveau sur « Analyser le message ». La même référence est désormais signalée comme doublon et la seconde validation est bloquée pendant cette visite.
6. Essayez « Informations manquantes » et « Référence déjà reçue ». Le brouillon demande les précisions nécessaires ou signale la référence déjà présente. La fiche et le brouillon modifié peuvent être téléchargés en JSON.

Dans [la démo catalogue](../demos/catalogue.html), cliquez sur « Analyser le lot ». Deux produits deviennent validables. Un SKU dupliqué et un prix absent sont bloqués. Validez les deux produits, puis exportez leur CSV. L’export contient les identifiants, SKU et prix d’origine, ainsi que les descriptions de démonstration. L’annulation d’une validation retire la ligne de l’export.

## Importer et exécuter le workflow n8n

1. Créez un workflow dans votre instance n8n.
2. Dans son menu, choisissez l’import depuis un fichier et sélectionnez [devis-validation-demo.json](../workflows/devis-validation-demo.json).
3. Exécutez le workflow manuellement et ouvrez la sortie de « Vérifier les résultats ».

Le fichier comprend un déclencheur manuel et trois nœuds Code. Aucun identifiant externe n’est demandé. Les six cas attendus sont les suivants.

| Cas | Résultat attendu |
| --- | --- |
| Demande complète | Un brouillon en attente de validation |
| Rejeu de la même référence | Doublon écarté, aucun deuxième brouillon |
| Service manquant | Demande à compléter |
| Espaces, casse et quantité en texte | Adresse normalisée et quantité entière, un brouillon |
| Adresse invalide | Demande à compléter |
| Quantité non positive | Demande à compléter |

Le bilan attendu affiche **6 cas réussis, 2 brouillons, 3 demandes à compléter et 1 doublon écarté**. Une assertion provoque une erreur si un résultat diffère de l’attendu.

## Vérifications et portée de la preuve

Le workflow source a été exécuté avec succès dans une instance locale n8n 2.47.6 le 13 novembre 2026. Cette copie conserve ses nœuds et son code. Le 18 novembre 2026, les trois blocs JavaScript de la copie ont aussi été réexécutés localement dans Node.js, avec les six résultats attendus. Les interactions de validation, de rejeu et d’export ont également été vérifiées par simulation DOM en JavaScript local. Le rendu visuel et la fenêtre système d’impression de cette copie demandent un essai dans votre navigateur.

Les pages HTML sont des maquettes autonomes. Le workflow n8n et les pages s’essaient séparément. La validation humaine du workflow est représentée par le statut « en_attente ». Le clic de validation et l’impression PDF sont démontrés dans la page devis.

## Limites

- L’extraction du message dans la page devis utilise des libellés comme « Intervention », « Lieu » et « Délai ». Les messages libres et les pièces jointes demanderaient une autre étape d’extraction.
- Le dédoublonnage du workflow porte sur une même exécution. Celui de la page devis dure jusqu’au rechargement. Un pilote réel demanderait un stockage persistant et des essais de rejeu entre exécutions.
- Les prix et la TVA servent au calcul fictif de démonstration. Les descriptions du catalogue sont prédéfinies. Le catalogue porte sur quatre lignes intégrées à la page.
- Aucune connexion à une messagerie, un CRM, PrestaShop, un service d’IA ou une API externe n’est configurée. Aucun message ou devis n’est envoyé.
- Les essais présentés portent sur des données fictives. La connexion aux outils du client, les droits, la gestion des erreurs et les critères métier se cadrent et se testent avant utilisation réelle.

Les fichiers ne contiennent aucun secret, identifiant d’accès ou dossier client. Utilisez des exemples fictifs pour vos essais.
