(() => {
  const pick = $0;
  const VIS = { 'border-radius': '0px', 'box-shadow': 'none', 'background-color': 'rgba(0, 0, 0, 0)', 'background-image': 'none', 'border-top-width': '0px', 'padding': '0px', 'overflow': 'visible', 'outline-style': 'none' };
  const nom = (e) => e.tagName.toLowerCase() + (e.classList.length ? '.' + [...e.classList].join('.') : '');
  const taille = (e) => { const r = e.getBoundingClientRect(); return Math.round(r.width) + 'x' + Math.round(r.height); };
  const porte = (e, ps) => {
    const cs = getComputedStyle(e, ps);
    if (ps && cs.content === 'none') return [];
    return Object.keys(VIS).filter((p) => cs.getPropertyValue(p) !== VIS[p]).map((p) => p + ': ' + cs.getPropertyValue(p));
  };
  const decls = (st) => st.cssText.split(/;(?![^(]*\))/).map((x) => x.trim()).filter(Boolean)
    .filter((x) => x.startsWith('--') || /^(border|padding|outline|box-shadow|background)/.test(x));
  const bloc = (t, d) => '  ' + t + ' {\n' + d.map((x) => '    ' + x + ';').join('\n') + '\n  }';
  const recettes = (e, ps) => {
    const out = [];
    const walk = (list, ctx, parent) => {
      for (const r of list) {
        if (r.media) { walk(r.cssRules, '@media ' + r.media.mediaText, parent); continue; }
        let full = parent;
        if (r.selectorText) {
          full = r.selectorText.split(',').map((s) => s.trim()).map((s) => !parent ? s : s.includes('&') ? s.replace(/&/g, parent) : parent + ' ' + s).join(', ');
          let ok = false;
          for (const s of full.split(',').map((s) => s.trim()).filter((s) => ps ? s.endsWith(ps) : !/::?(before|after)$/.test(s))) {
            try { if (e.matches(ps ? s.slice(0, -ps.length) || '*' : s)) ok = true; } catch (err) {}
          }
          const d = ok ? decls(r.style) : [];
          if (d.length) out.push(bloc((ctx ? '/* ' + ctx + ' */ ' : '') + full, d));
        }
        if (r.cssRules) walk(r.cssRules, ctx, full);
      }
    };
    if (!ps && e.style.length) out.push(bloc('style=""', decls(e.style)));
    // Un composant web range ses règles dans son shadowRoot, pas dans document.styleSheets.
    const root = e.getRootNode();
    for (const s of [...(root.styleSheets || []), ...(root.adoptedStyleSheets || [])]) { try { walk(s.cssRules, '', ''); } catch (err) { out.push('  /* illisible : ' + s.href + ' */'); } }
    return out;
  };
  const r0 = pick.getBoundingClientRect();
  const meme = (e) => { const r = e.getBoundingClientRect(); return Math.abs(r.width - r0.width) < 3 && Math.abs(r.height - r0.height) < 3; };
  // Seuls les calques de la même taille que l'élément choisi : parents et enfants qui le recouvrent.
  const pile = [pick];
  for (let e = pick.parentElement; e && e !== document.body && meme(e); e = e.parentElement) pile.unshift(e);
  pick.querySelectorAll('*').forEach((c) => { if (meme(c)) pile.push(c); });
  const lignes = [];
  for (const e of pile) for (const ps of ['', '::before', '::after']) {
    const p = porte(e, ps);
    if (p.length || (e === pick && !ps)) lignes.push((e === pick && !ps ? '>>> ' : '') + nom(e) + ps + '  [' + taille(e) + ']\n  ' + (p.join('\n  ') || '(aucun style visible : sélectionne plutôt son parent, le <button> ou le <a>)') + '\n  -- recette --\n' + (recettes(e, ps).join('\n') || '  (rien)'));
  }
  copy(lignes.join('\n\n'));
  return lignes.length + ' calques copiés';
})();
