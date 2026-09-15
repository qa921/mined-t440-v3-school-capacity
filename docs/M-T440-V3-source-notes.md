# M-T440-V3 source notes — school capacity visualization

**Recorded:** 2026-09-15. This is source material and deliberately does not describe an implementation.

## Non-negotiable meaning

The first panel is the **observed current school-seat pressure** for the selected market. The middle panel is a **planner-selected capacity-addition assumption**. The final panel is a **projected seat-pressure scenario**. Do not label the projection as a measured result, achieved relief, or observed outcome.

The home diagram, its accessible text alternative, the legend, and the short explainer must describe those same three relationships in that order. A quiet layout is preferred: one directional sequence, no decorative metrics, and short labels.

## Locale and market facts

- Languages: `en`, `nl`.
- Current code exposes `NL` and `DE`; `LU` and `DK` were added as source data in `data/turn2-locale-additions.json` and need real UI handling.
- Language and market are separate controls. A language change must never select a different market.
- Both `/` and `/explainer/` should preserve `lang`, `market`, and unrelated query keys when navigating or changing a control.
- In the absence of a valid language, `en` is the safe default. If market is missing, `NL` is the safe default. The invalid-language URL canonicalization choice is intentionally open (see R24).

## Known intentional discrepancies in the current baseline

1. The home visual says only `Baseline → pathway`; it omits the planner assumption and can be misread as causal evidence.
2. English and Dutch JSON have titles and long copy only; no panel/legend/short explainer keys.
3. `app.js` changes the document language attribute but does not load translations, read query state, or wire the market control.
4. The explainer has neither shared controls nor state-carrying navigation.
5. `LU` and `DK` source labels exist but are not available in the current HTML.

## Open decisions for the eventual Drive handoff

- exact Dutch noun choice for the final panel (`Verwachte plaatsdruk` is the audit fixture, not a mandated final phrase);
- whether invalid `lang` should remain in the address bar after the English fallback;
- final narrow-width/contrast review, including Dutch label wrapping;
- no deployment or publication status has been supplied.
