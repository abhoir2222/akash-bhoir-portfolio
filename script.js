const list = document.querySelector("#recommendation-list");

function recommendationCard(recommendation) {
  const article = document.createElement("article");
  article.className = "quote-card";

  const quote = document.createElement("blockquote");
  quote.textContent = recommendation.quote;

  const footer = document.createElement("footer");
  const attribution = document.createElement("div");
  const name = document.createElement("strong");
  name.textContent = recommendation.name;

  const title = document.createElement("p");
  title.textContent = `${recommendation.role}, ${recommendation.company}`;

  attribution.append(name, title);

  const detail = document.createElement("p");
  detail.textContent = recommendation.relationship;

  article.append(quote, footer);

  footer.append(attribution, detail);

  if (recommendation.documentUrl) {
    const link = document.createElement("a");
    link.className = "letter-link";
    link.href = recommendation.documentUrl;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = "View letter";
    article.append(link);
  }

  return article;
}

if (list && Array.isArray(window.recommendations)) {
  window.recommendations.forEach((recommendation) => {
    list.appendChild(recommendationCard(recommendation));
  });
}
