# Jetons de l'admin de référence comparés à Sirius

Source : [admin-tokens.css](admin-tokens.css), 721 jetons
`--p-*` relevés le 2026-10-09 dans la console de l'admin de référence. Ce sont les
valeurs **calculées** par le navigateur, donc celles que l'admin affiche
vraiment.

Une première version de ce fichier reposait sur une capture de l'inspecteur
où la plupart des lignes étaient barrées, donc écrasées par d'autres règles.
Ses valeurs étaient fausses (cartes à 12 px au lieu de 20, fenêtres à 16 au
lieu de 24). Elle est remplacée par celle-ci.

En face : ce que Sirius fait réellement, relevé dans `src/tokens.css` et
dans les CSS des composants, sur la branche `feat/momo-field`.

Légende : **=** identique, **≈** très proche, **≠** différent.
1 rem = 16 px.

## Rayons

| Usage | Référence | Sirius | Écart |
|---|---|---|---|
| Boutons (`-action`) | pilule (624.9375rem) | pilule (999 px) | = |
| Menus, popovers (`-popover`) | 1rem (16 px) | 16 px (`--sirius-radius-xl`) | = |
| Lignes de menu (`-option-item`) | .75rem (12 px) | 12 px (`--sirius-radius-item`) | = |
| Intérieur du Banner (`-banner-inner`) | 1rem (16 px) | Banner 16 px | = |
| Badge (`-tag`) | .5rem (8 px) | 8 px | = |
| Case à cocher (`-checkbox`) | .25rem (4 px) | 4 px | = |
| Case cochée (`-checkbox-checked`) | 4 px + 1 px = 5 px | 4 px | ≠ |
| Cartes (`-container`) | 1.25rem (20 px) | Card, CalloutCard 16 px ; MetricCard, AccountConnection 12 px | ≠ |
| Champs de saisie (`-control`) | .75rem (12 px) | champ, select 8 px | ≠ |
| Intérieur d'un champ (`-control-inner`) | .5rem (8 px) | | absent |
| Élément (`-element`) | .625rem (10 px) | | absent |
| Fenêtres de dialogue (`-dialog`) | 1.5rem (24 px) | Modal 12 px | ≠ |
| Anneau de focus (`-focus`) | .25rem (4 px) | suit la forme de l'élément | ≠ |
| Avatar (`-avatar`) | clamp(6 px, 30 %, 12 px) | pas d'Avatar | absent |
| Image (`-media`) | clamp(6 px, 25 %, 12 px) | | absent |
| Image compacte (`-media-compact`) | .25rem (4 px) | | absent |
| Aperçu (`-preview`) | pilule | | absent |
| Forme des coins (`-corner-shape`) | superellipse(1.333) | arrondi classique | ≠ |

Bilan : la direction artistique v1.0.7 (pilules, menus à 16, lignes à 12,
Banner à 16) correspond déjà à l'admin de référence actuel. Les écarts restants
sont les cartes (16 au lieu de 20), les champs (8 au lieu de 12) et le Modal
(12 au lieu de 24).

L'échelle `--p-border-radius-0` à `-full` est identique à `--s-border-radius-*`.

## Ombres

| Référence | Sirius | Écart |
|---|---|---|
| `--p-shadow-bevel-100` | `--sirius-shadow-bevel` | = (mêmes opacités : 13 %, 17 %, `#cccccc80`) |
| `--p-shadow-100` (6 couches) | `--s-shadow-100` (7 couches) | ≠ : la nôtre a en plus une première couche `0 0 1px #ddd`, venue de la capture de l'inspecteur (un autre jeton composé) |
| `--p-shadow-container`, `--p-shadow-section` | | absent |
| `--p-shadow-popover` (5 couches) | `--sirius-shadow-popover` (biseau + 1 ombre) | ≠ |
| `--p-shadow-dialog` (6 couches) | | absent |
| `--p-shadow-200` à `-600`, `-toast`, `-banner` | | absent |
| `--p-shadow-input`, `-input-focus`, `-input-error` | | absent |

## Couleurs de base

| Usage | Référence | Sirius | Écart |
|---|---|---|---|
| Texte | `#101010` | `--sirius-text` `#202223` | ≠ |
| Texte secondaire | `#4a4a4a` | `--sirius-text-subdued` `#6d7175` | ≠ |
| Texte tertiaire | `#606060` | `--sirius-text-faint` `#8c9196` | ≠ |
| Texte désactivé | `#a6a6a6` | `--sirius-text-disabled` `#b5b5b5` | ≠ |
| Bordure | `#dddddd` | `--sirius-border` `#e1e3e5` | ≈ |
| Bordure secondaire | `#f2f2f2` | `--sirius-border-subdued` `#ebecee` | ≈ |
| Bordure au survol | `#d0d0d0` | `--sirius-border-hover` `#c9cccf` | ≈ |
| Surface | `#ffffff` | `--sirius-surface` `#ffffff` | = |
| Surface secondaire | `#f7f7f7` | `--sirius-surface-subdued` `#f7f7f8` | ≈ |
| Surface au survol | `#f7f7f7` | `--sirius-surface-hover` `#f9fafb` | ≈ |
| Surface active | `#f2f2f2` | `--sirius-surface-active` `#f1f2f4` | ≈ |
| Primaire | noir `#101010` | vert SKS `#00824c` | ≠ voulu |

Les gris de référence sont neutres (rouge = vert = bleu). Les nôtres tirent
légèrement vers le bleu, c'est la palette de l'ancien Polaris.

## Typographie

| Usage | Référence | Sirius |
|---|---|---|
| Police | `Inter` (version maison) | `SKS-Inter` |
| Variantes d'Inter | `font-feature-settings: "calt", "ss03", "cv09", "cv02", "cv03", "cv04"` | aucune |
| Texte courant | 13 px / 20 px, approche -.01em | 13 px, approche variable selon le composant |
| Titre de carte (`heading-medium`) | 13 px, graisse 500 | Card 15 px / 650, CalloutCard 13 px / 650 |
| Libellé de bouton | 12 px / 16 px, graisse 500 | 13 px, graisse 600 |
| Graisses | 400, 500, 600 | 450, 550, 600, 650 |

## Familles absentes de Sirius

Espacements (`--p-space-*`, de 1 px à 128 px), tailles et interlignes de
texte, approche des lettres, durées et courbes d'animation
(`--p-motion-*`), z-index, points de rupture, largeurs et hauteurs,
épaisseurs de bordure.

Familles sans intérêt pour SKS : `code-text-*`, `avatar-*` (couleurs),
`video-thumbnail-*`, `ai-*` (à revoir pour Momo), `nav-*` (barre latérale
sombre de la référence), les drapeaux `--p-when-*`.

## Rayons propres à une carte

| Référence | Sirius | Écart |
|---|---|---|
| `--sidekick-field-border-radius` : calc(750 - 100) = 26 px | `--momo-field-border-radius` (MomoField), 26 px | = |
