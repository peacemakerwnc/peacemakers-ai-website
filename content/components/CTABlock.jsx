/**
 * Reusable mid-post / end-of-post CTA for blog MDX (future Next.js build).
 * Static HTML equivalent: <aside class="cta-block"> in peacemakers-ai/resources/
 */
export default function CTABlock({ title, description, buttonText, buttonHref }) {
  return (
    <aside className="cta-block" aria-label="Call to action">
      <h3 className="cta-block-title">{title}</h3>
      <p className="cta-block-description">{description}</p>
      <a className="btn btn-primary" href={buttonHref}>
        {buttonText}
      </a>
    </aside>
  );
}
