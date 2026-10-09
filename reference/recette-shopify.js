// Recette d'un élément de l'admin Shopify.
// 1. Clic droit sur l'élément, « Inspecter » : il devient $0.
// 2. Dans la console : allow pasting, puis coller ce script.
// 3. Le résultat est copié dans le presse-papiers.
// On peut inspecter n'importe quoi DANS l'objet (son titre, son texte) :
// le script remonte tout seul jusqu'aux calques qui le dessinent.
(() => {
  const pick = $0;
  // Propriétés qui dessinent la forme d'un objet, et leur valeur « rien »
  const VIS = {
    'border-radius': '0px', 'box-shadow': 'none', 'background-color': 'rgba(0, 0, 0, 0)',
    'background-image': 'none', 'border-top-width': '0px', 'padding': '0px',
    'overflow': 'visible', 'outline-style': 'none',
  };
  const nom = (e) => e.tagName.toLowerCase() + (e.classList.length ? '.' + [...e.classList].join('.') : '');
  const taille = (e) => { const r = e.getBoundingClientRect(); return Math.round(r.width) + 'x' + Math.round(r.height); };

  // Ce que l'élément porte réellement à l'écran (valeurs calculées)
  const porte = (e, ps) => {
    const cs = getComputedStyle(e, ps);
    if (ps && cs.content === 'none') return [];
    return Object.keys(VIS).filter((p) => cs.getPropertyValue(p) !== VIS[p]).map((p) => p + ': ' + cs.getPropertyValue(p));
  };

  // Déclarations telles qu'écrites : cssText garde « border-radius: var(...) »,
  // que le navigateur découperait sinon en quatre coins vides.
  const decls = (st) => st.cssText.split(/;(?![^(]*\))/).map((x) => x.trim()).filter(Boolean)
    .filter((x) => x.startsWith('--') || /^(border|padding|outline|box-shadow|background)/.test(x));
  const bloc = (titre, d) => '  ' + titre + ' {\n' + d.map((x) => '    ' + x + ';').join('\n') + '\n  }';

  // La recette : chaque règle CSS qui atteint l'élément, avec ses var() et calc()
  const recettes = (e, ps) => {
    const out = [];
    // parent : le sélecteur englobant, pour résoudre le & du CSS imbriqué
    const walk = (list, ctx, parent) => {
      for (const r of list) {
        if (r.media) { walk(r.cssRules, '@media ' + r.media.mediaText, parent); continue; }
        let full = parent;
        if (r.selectorText) {
          full = r.selectorText.split(',').map((s) => s.trim())
            .map((s) => !parent ? s : s.includes('&') ? s.replace(/&/g, parent) : parent + ' ' + s).join(', ');
          const parts = full.split(',').map((s) => s.trim())
            .filter((s) => ps ? s.endsWith(ps) : !/::?(before|after)$/.test(s));
          let ok = false;
          for (const s of parts) {
            try { if (e.matches(ps ? s.slice(0, -ps.length) || '*' : s)) ok = true; } catch (err) {}
          }
          const d = ok ? decls(r.style) : [];
          if (d.length) out.push(bloc((ctx ? '/* ' + ctx + ' */ ' : '') + full, d));
        }
        if (r.cssRules) walk(r.cssRules, ctx, full);
      }
    };
    // Les valeurs posées directement sur l'élément (attribut style) d'abord
    if (!ps && e.style.length) out.push(bloc('style="" (sur l\'élément)', decls(e.style)));
    for (const s of document.styleSheets) {
      try { walk(s.cssRules, '', ''); } catch (err) { out.push('  /* feuille illisible : ' + s.href + ' */'); }
    }
    return out;
  };

  // La pile : les ancêtres de $0 jusqu'à <body>, $0, et ses descendants de
  // même taille que lui (les calques superposés)
  const pile = [];
  for (let e = pick; e && e !== document.body; e = e.parentElement) pile.unshift(e);
  const r0 = pick.getBoundingClientRect();
  pick.querySelectorAll('*').forEach((c) => {
    const r = c.getBoundingClientRect();
    if (Math.abs(r.width - r0.width) < 3 && Math.abs(r.height - r0.height) < 3) pile.push(c);
  });

  // On ne garde que les calques qui dessinent quelque chose
  const lignes = [];
  for (const e of pile) {
    for (const ps of ['', '::before', '::after']) {
      const p = porte(e, ps);
      if (!p.length) continue;
      lignes.push((e === pick && !ps ? '>>> ' : '') + nom(e) + ps + '  [' + taille(e) + ']\n  '
        + p.join('\n  ') + '\n  -- recette --\n' + (recettes(e, ps).join('\n') || '  (aucune règle lisible)'));
    }
  }
  copy(lignes.join('\n\n'));
  return lignes.length + ' calques copiés';
})();
