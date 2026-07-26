# Homepage and testimonials refinement

## Version record

- Source version: `v0.11.9-ai`
- Source folder: `/Users/mikeskipper/Documents/i spy website/production/i-spy-website-live`
- Source archive: `/Users/mikeskipper/Documents/i spy website/outputs/ispy-website-selected-concept-v0.11.9-ai.zip`
- Source Git branch: `main`
- Source commit: `ef004fd` (`Publish approved portrait crop`)
- Output version: `v0.11.9-aj`
- Output folder: `/Users/mikeskipper/Documents/i spy website/outputs/i-spy-website-selected-concept-v0.11.9-aj`
- Review status: private preview only

The source folder and archive were preserved. The public production website was not updated as part of this refinement.

## Homepage refinement

The homepage `Working with i-Spy` section keeps its approved heading and introductory paragraph.

The five homepage service-summary cards were removed. They remain available in full on the unchanged How We Help page.

One existing-style call to action was added:

- Label: `See how i-Spy can help`
- Destination: `/how-we-help`

The section uses approximately `4.5rem` vertical padding at desktop widths and `3.25rem` at mobile widths. The gap above the CTA is `1.75rem`.

The page sequence is unchanged. `Brand experience` follows `Working with i-Spy`, and the three existing homepage testimonials remain unchanged.

## Testimonials refinement

`testimonials.html` is the static source of truth. No testimonial generator is used.

The testimonials page now contains 12 testimonials, arranged as exactly three testimonials in each of the four existing categories:

1. Strategic thinking
2. Commercial understanding
3. Partnership
4. Creative quality

The three approved additions are:

- Jonathan Hook, Founder & CEO, Norwich Accountancy and MacInnes Whisky
- David Godber, Managing Partner, The Argenti Group
- Marsid Greenidge, Group Head of Communications

The spelling `David Godber` is used consistently.

## Files changed

- `index.html`
- `testimonials.html`
- `concept-one-completion.css`
- `concept-one-final.css`
- `CHANGELOG.md`
- `HOMEPAGE_AND_TESTIMONIALS_REFINEMENT.md`
- Review screenshots in `design-reviews/homepage-simplification-testimonials-expansion/`

`products.html`, `script.js` and `testimonials.css` remain byte-for-byte identical to the approved source.

## Quality assurance

Responsive checks were completed at:

- 1440px
- 1280px
- 1024px
- 768px
- 430px
- 390px
- 375px

The homepage, How We Help page and testimonials page were checked at every width.

Confirmed:

- no horizontal overflow
- no clipped testimonial cards
- no duplicate HTML IDs
- correct category order and reading order
- exactly three testimonials per category
- meaningful CTA text and destination
- visible keyboard focus treatment remains present
- decorative testimonial quote marks retain empty alt text and `aria-hidden="true"`
- homepage service summaries are absent
- all five approved service names remain on the How We Help page
- homepage testimonials remain unchanged
- no image, shirt-colour or other portrait changes were made

## Review evidence

Screenshots are stored in:

`design-reviews/homepage-simplification-testimonials-expansion/`

This includes:

- the `Working with i-Spy` section before and after at 1440px
- the revised homepage section at 390px
- the section transitions above and below the revised homepage section
- all four testimonial categories
- a representative mobile testimonial layout
- complete desktop and mobile page captures

