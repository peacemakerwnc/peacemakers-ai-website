/**
 * Reusable lead-magnet opt-in for blog MDX (future Next.js build).
 * Static HTML equivalent: <form class="lead-magnet-form" data-lead-magnet-form>
 */
export default function LeadMagnetForm({ title, description, buttonText, formEndpoint }) {
  return (
    <aside className="lead-magnet-form" aria-label="Free resource download">
      <h3 className="lead-magnet-title">{title}</h3>
      <p className="lead-magnet-description">{description}</p>
      <form
        className="lead-magnet-form-inner"
        data-lead-magnet-form
        data-success-redirect={formEndpoint}
        action="https://formspree.io/f/maqaaddz"
        method="POST"
        novalidate
      >
        <input type="hidden" name="page_source" value="lead-magnet" />
        <input type="hidden" name="submitted_at" value="" />
        <input type="hidden" name="_subject" value="Nonprofit AI Lead Magnet Request" />
        <input type="hidden" name="industry" value="Nonprofit" />
        <input type="hidden" name="needs" value="Lead magnet download request" />
        <label className="sr-only" htmlFor="lead-magnet-email">
          Email
        </label>
        <input
          id="lead-magnet-email"
          name="email"
          type="email"
          autocomplete="email"
          placeholder="Your work email"
          required
        />
        <input type="hidden" name="full_name" value="Lead magnet subscriber" />
        <button className="btn btn-secondary" type="submit" data-submit-label={buttonText}>
          {buttonText}
        </button>
        <p className="form-status" data-form-status aria-live="polite" />
      </form>
    </aside>
  );
}
