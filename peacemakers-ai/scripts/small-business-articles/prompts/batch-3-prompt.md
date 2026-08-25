Generate batch 3 for the AI for Small Business content cluster.

Batch name: Sales, marketing & CX
Briefs: 2, 7, 10, 14, 23, 28
Target module: peacemakers-ai/scripts/small-business-articles/batch3.py

Follow the writing rules in the original cluster brief:
- 1,200–1,800 words per article, direct 2-sentence answer up top
- Mid CTA → Book a Free AI Fit Assessment → /services/ai-strategy-small-business
- Lead magnet → /resources/ai-small-business-starter-kit
- 2-3 internal links to sibling posts in /blog/ai-for-small-business/
- Shared end CTA customized to each article topic
- Full frontmatter + HTML via the existing generator pattern

After generating:
1. Add article data to batch3.py (ARTICLES dict, same shape as batch1.py)
2. Mark batch 3 status published in batch-schedule.json with today's date
3. Run: python3 peacemakers-ai/scripts/generate-small-business-blog-html.py
4. Update sitemap.xml with new URLs
5. Update resources.html if needed
6. Deploy: cd peacemakers-ai && npx vercel deploy --prod --yes

Brief metadata lookup: peacemakers-ai/scripts/small-business-articles/briefs.py
Already published slugs: ['ai-for-email-management-and-organization', 'automate-customer-follow-ups-with-ai', 'automate-social-media-posts-with-ai', 'best-ai-tools-for-scheduling-and-calendar-management', 'how-do-i-know-if-ai-is-right-for-my-business', 'how-much-does-ai-cost-for-small-business', 'implement-ai-without-disrupting-business', 'roi-of-ai-tools-for-small-businesses', 'use-ai-to-screen-job-applications', 'which-ai-tool-should-i-choose-for-my-small-business', 'which-repetitive-tasks-to-automate-first']
