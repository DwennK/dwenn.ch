> Piste initiale rejetée. Ces images ne sont plus utilisées dans le site ; fichiers conservés sous `output/archive-v1/art/`.

# Image production — L’atelier du déclic

Date: 22 October 2026. All images generated with **Codex built-in ImageGen**, never an external CLI/API. The wide exploration was selected as production key art after direct visual inspection; later views use it as an explicit reference. No generated product UI, fake portrait, text, or logo.

## Selected assets

| Asset | Intrinsic dimensions | Use | Optimization |
| --- | --- | --- | --- |
| `/images/art/atelier-wide.webp` | 1586 × 992 | Desktop key art, image weighted toward the right; quiet upper-left space | WebP q88, 124 KiB |
| `/images/art/atelier-wide-900.webp` | 900 × 563 | Smaller responsive wide source | WebP q84 |
| `/images/art/atelier-mobile.webp` | 1024 × 1536 | Deliberately recomposed portrait of the same installation | WebP q86, 95 KiB |
| `/images/art/atelier-mobile-720.webp` | 720 × 1080 | Mobile responsive source | WebP q84 |
| `/images/art/atelier-detail.webp` | 1536 × 1024 | Macro view of the orange/blue/ivory junction | WebP q86, 185 KiB |
| `/images/art/atelier-detail-900.webp` | 900 × 600 | Smaller macro source | WebP q84 |

No creative editing or compositing with scripts: `cwebp` is used only for proportional responsive resizing and format/quality optimization. Type, buttons, interfaces and navigation remain HTML.

## Visual inspection

- Wide: approved. Strong architectural depth, a coherent continuous ribbon, crisp readable materials, balanced upper-left ivory space. No lettering/UI/spheres or obvious structural defects.
- Mobile: approved. Same palette and object identity; 22% quiet space above the sculpture; the orange path remains readable on a vertical canvas.
- Detail: approved. Same coherent material junction and tactile lighting, useful for a quieter editorial block.
- Transparent extraction: **rejected**, including one repair attempt. White/blue edge residues remain visible on a dark background; it is deliberately excluded from shipped assets. Use opaque key art or a code-defined crop instead.
- Images are related editorial views, **not animation frames**; do not crossfade them as if they form a physically continuous turntable.

## Original generation files

All originals remain in `/Users/dwenn/.codex/generated_images/01a1651e-f5f5-7a70-84ed-ac7b1b20ce55/`:

- Wide: `exec-25c521c0-b7cf-406e-8dfc-26f90843cbd5.png`
- Mobile: `exec-b987dfa2-d261-4d80-a049-8cfbbcff39db.png`
- Detail: `exec-e5c41f6f-e431-470e-8195-16c70acc43e6.png`
- Rejected alpha: `exec-fa45ce42-947b-4e28-b123-cac00dc83b69.png`
- Rejected alpha repair: `exec-fe175f69-e8c0-43f0-99fe-efd9cd38ac46.png`

## Exact prompts

### 1. Wide comp / selected production art

Use case: stylized-concept. Asset type: wide editorial visual direction key art, 16:10 landscape, for a Swiss full-stack developer's portfolio called L'atelier du déclic. Create a gallery-quality cinematic physical sculpture that makes the process of aligning product layers tangible: three monumental rectangular cobalt-blue anodized aluminium frames standing at slightly different depths, clean warm-ivory porcelain planes passing through them, and a single vivid vermilion-orange broad folded ribbon threading with precision through the apertures. The frames have a clear visual architectural logic, never an impossible knot. The ribbon is the ingenious connecting path. It looks like an extraordinary physical design object photographed in an architect's atelier, tactile edges, paper-like folds, subtle real surface microtexture.
Composition: wide asymmetric 16:10 canvas. Sculpture is large, concentrated in right 60% and extending from foreground toward upper-right; leftmost 25% quiet warm ivory negative space reserved for giant live HTML type. Strong verticals, oblique diagonal ribbon, a ground plane and meaningful long shadows. Camera low three-quarter perspective, 60mm editorial lens. Background and ground warm ivory #f2f0e8. Blue #243dff, orange #ff5b27. Directional afternoon studio light from upper left, beautifully controlled blue reflections, deep but open shadows, sharp tactile form.
Do not make a website screenshot. Do not include any text, words, letters, logos, actual UI, screens, computers, dashboard, typography, people, spheres, random floating debris, particles, gradients, chrome blobs, glass balls, sci-fi neon. The result is premium sculptural key art, not an icon or infographic.

### 2. Referenced mobile recomposition

Reference: wide original.

Use case: precise-object-edit. Reference image is the selected key art for the sculptural architecture of L'atelier du déclic. Produce a tall portrait 2:3 production image for the mobile hero by recomposing the SAME physical installation; preserve its actual three cobalt-blue rectangular metal portals, warm ivory slab planes, and single vermilion-orange broad ribbon threading through the portals. Preserve exact material texture, scale relationships, palette, lighting direction and physically convincing shadows. Change only the camera/framing to fit a tall canvas with strong spatial depth: large foreground portal lower-right, ribbon entering bottom-left, remaining portals receding toward upper-right. Keep topmost 22 percent quiet ivory for live HTML text, all key objects in the center/lower 75 percent. The result should feel like another photograph of this same physical scene, not an independent sculpture. No readable text, logos, lettering, computers, screens, UI, spheres or new decorative objects. Gallery-quality tactile render with direct studio light.

### 3. Referenced macro detail

Reference: wide original.

Use case: precise-object-edit. Reference image is the SAME sculpture for L'atelier du déclic. Create a distinct close-up macro photograph of this actual installation for an editorial section about the satisfaction of solving a problem. Landscape 3:2 crop. Camera is now intimately close to the junction where the continuous orange folded ribbon precisely passes between one cobalt-blue rectangular metal portal edge and a warm-ivory porcelain plane. The orange path cuts dynamically from lower left to upper right, cobalt occupies right third, warm ivory and very dark blue shadows create rhythmic bold planes. We clearly recognize materials and geometry from the reference. High-end tactile product photography, directional light grazing the orange paper-like fine surface, extremely precise edges, a meaningful slit and fit, convincing contact shadows. Sharp main junction with gentle shallow depth of field far away. Keep the reference colors #243dff blue, #ff5b27 orange and ivory. No words, logos, symbols, computer/UI, spheres, extra objects or humans. This is a macro of existing key art, not a new different abstract object.

### 4. Rejected transparent extraction

Reference: wide original. `transparent_background: true`.

Use case: background-extraction. Edit target is the referenced wide image. Isolate the complete exact sculpture from this image on a genuinely transparent background for HTML layer compositing. Preserve the three cobalt-blue rectangular metal frames, all ivory slab planes and the entire vivid orange folded ribbon. Preserve precisely their current three-quarter camera, relative positions, perspective, textures, light, colors and exact silhouette. Remove ONLY the cream studio backdrop and ground plane. Keep no rectangular white canvas; transparency also through the apertures wherever the background was visible. Keep subtle natural contact shadow beneath only if it can have alpha transparency. Do not crop away sculpture edges. Do not add anything. This is a precise production cutout, not a new composition. No typography, no text.

### 5. Rejected alpha-edge repair

Reference: rejected alpha extraction. `transparent_background: true`.

Use case: background-extraction / precise-object-edit. Repair ONLY the transparent cutout edges of this sculpture. Preserve the sculpture geometry, color, materials, lighting, positioning and transparent background unchanged. Current edges have visible speckled white halos, cream crumbs, blue fuzzy noise and fringes around the porcelain slabs and blue metal frames. Remove ALL those residues completely. Every hard architectural edge must be beautifully smooth and crisp with proper subpixel antialiasing and clean alpha, like a professional meticulous hand-clipped product photograph. Transparency in every hole, no disconnected residual pixels. Keep every solid white porcelain plane itself intact, do not mistake the material for the background. Do not add shadows or a backdrop. Do not change any object, camera, color, texture or geometry. Output genuinely transparent PNG.

## Integration recommendations

Reserve intrinsic dimensions and use a `picture` mobile source. Preload only the actual first-viewport image when used; lazy-load the detail. Keep generated art as a conceptual studio installation, not a claim about any real product interface. Alt text can be empty when the scene is decorative and the adjacent HTML already explains the full-stack narrative.
