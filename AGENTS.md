# Solace Agent Instructions (Oxfords UI/UX Standard)

When building, modifying, or reviewing any user interface in this project, follow `skills/oxfords/SKILL.md`:
1. Follow the 9-step Build Order (Intent -> Content first -> Component selection -> Edge alignment -> Neutral + 3-color palette -> Hierarchy -> Disclosure -> Container -> Invisible layer).
2. Consult the relevant surface reference in `skills/oxfords/references/` (`app-ui.md`, `palettes.md`, `slop-floor.md`, `states-forms-copy.md`).
3. Comply with the Done Gate before declaring UI work finished.
4. Eliminate AI slop tells: no emojis in UI buttons, no em-dashes in visible copy, no purple/indigo text gradients, no side accent rails, no default Inter/Geist fonts without justification, and no cards inside cards.
5. Run the slop checker to verify compliance:
   ```bash
   node .agents/skills/oxfords/scripts/check.mjs apps/web/src
   ```
