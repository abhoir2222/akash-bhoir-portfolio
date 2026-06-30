# Akash Bhoir Portfolio

Simple static portfolio for Akash Bhoir. Open `index.html` directly, or serve the folder locally:

```bash
python3 -m http.server 4173
```

Then visit `http://localhost:4173`.

## Updating Recommendations

Recommendations live in `data/recommendations.js`.

To add another letter later, append another object to `window.recommendations`:

```js
{
  name: "Recommender Name",
  role: "Job Title",
  company: "Company",
  relationship: "Worked with Akash on ...",
  contact: "optional@email.com",
  documentUrl: "https://example.com/recommendation.pdf",
  quote: "Short public-facing summary or excerpt from the recommendation."
}
```

Keep the public quote concise and avoid adding private contact details to the rendered page unless Akash approves it. Host recommendation PDFs in a stable location such as Google Drive, Dropbox, S3, or the final website's assets folder, then paste the public PDF URL into `documentUrl`.
