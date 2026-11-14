/* ============================================================
   ARTICLES & INSIGHTS SHOWCASE
   Renders the homepage article grid from window.DevSpireArticles.
   One card per article; each card can expose several external
   publications (DEV.to, Medium) without duplicating the article.
   ============================================================ */
(function () {
  "use strict";

  var MAX_CARDS = 6;

  var PLATFORMS = {
    devto: { label: "DEV.to", icon: "fa-brands fa-dev" },
    medium: { label: "Medium", icon: "fa-brands fa-medium" }
  };

  var grid = document.querySelector("[data-articles-grid]");
  var data = window.DevSpireArticles;

  if (!grid || !data || !Array.isArray(data.all)) return;

  var dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC"
  });

  function isSafeUrl(value) {
    return typeof value === "string" && /^https:\/\/[^\s]+$/i.test(value);
  }

  function formatDate(value) {
    var time = Date.parse(value);
    if (isNaN(time)) return "";
    return dateFormatter.format(new Date(time));
  }

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (typeof text === "string") node.textContent = text;
    return node;
  }

  function icon(className) {
    var node = document.createElement("i");
    node.className = className;
    node.setAttribute("aria-hidden", "true");
    return node;
  }

  function externalLink(url, label) {
    var link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", label);
    return link;
  }

  function safePublications(article) {
    if (!Array.isArray(article.publications)) return [];
    return article.publications.filter(function (publication) {
      return PLATFORMS[publication.platform] && isSafeUrl(publication.url);
    });
  }

  function buildOverlay(article, publications) {
    var overlay = element("div", "article-card__overlay");

    if (article.category) {
      overlay.appendChild(element("span", "article-card__category", article.category));
    }

    var platforms = element("span", "article-card__platforms");
    publications.forEach(function (publication) {
      var chip = element("span", "article-card__platform-chip");
      chip.appendChild(icon(PLATFORMS[publication.platform].icon));
      chip.appendChild(document.createTextNode(publication.label));
      platforms.appendChild(chip);
    });
    overlay.appendChild(platforms);

    return overlay;
  }

  function buildMeta(article) {
    var meta = element("div", "article-card__meta");
    var published = formatDate(article.publishedDate);

    if (published) {
      var time = document.createElement("time");
      time.className = "article-card__date";
      time.dateTime = article.publishedDate;
      time.textContent = published;
      meta.appendChild(time);
      meta.appendChild(document.createTextNode(" "));
    }

    if (typeof article.readingTime === "number" && article.readingTime > 0) {
      if (published) {
        var dot = element("span", "article-card__dot");
        dot.setAttribute("aria-hidden", "true");
        meta.appendChild(dot);
      }
      var readTime = element("span", "article-card__readtime");
      readTime.appendChild(icon("far fa-clock"));
      readTime.appendChild(document.createTextNode(article.readingTime + " min read"));
      meta.appendChild(readTime);
      meta.appendChild(document.createTextNode(" "));
    }

    if (article.featured) {
      meta.appendChild(element("span", "article-card__featured", "Featured"));
    }

    return meta;
  }

  function buildActions(article, publications) {
    var actions = element("div", "article-card__actions");

    publications.forEach(function (publication) {
      var platform = PLATFORMS[publication.platform];
      var link = externalLink(
        publication.url,
        "Read " + article.title + " on " + platform.label + " (opens in a new tab)"
      );
      link.className = "article-card__pub article-card__pub--" + publication.platform;
      link.appendChild(icon(platform.icon));
      link.appendChild(element("span", "article-card__pub-label", "Read on " + platform.label));
      link.appendChild(icon("fas fa-arrow-up-right-from-square article-card__pub-ext"));
      actions.appendChild(link);
    });

    return actions;
  }

  function buildCard(article, publications) {
    var card = element("article", "article-card" + (article.featured ? " article-card--featured" : ""));
    if (article.accent) card.setAttribute("data-accent", article.accent);

    if (article.coverImage) {
      var media = element("div", "article-card__media");
      var image = document.createElement("img");
      image.src = article.coverImage;
      image.alt = "Cover image for \u201C" + article.title + "\u201D";
      image.width = 1200;
      image.height = 627;
      image.loading = "lazy";
      image.decoding = "async";
      media.appendChild(image);
      media.appendChild(buildOverlay(article, publications));
      card.appendChild(media);
    }

    var body = element("div", "article-card__body");
    body.appendChild(buildMeta(article));

    var title = element("h3", "article-card__title");
    var titleLink = externalLink(
      publications[0].url,
      article.title + " \u2014 read on " + PLATFORMS[publications[0].platform].label + " (opens in a new tab)"
    );
    titleLink.textContent = article.title;
    title.appendChild(titleLink);
    body.appendChild(title);

    if (article.description) {
      body.appendChild(element("p", "article-card__description", article.description));
    }

    if (Array.isArray(article.tags) && article.tags.length) {
      var tags = element("ul", "article-card__tags");
      article.tags.forEach(function (tag) {
        tags.appendChild(element("li", "article-card__tag", "#" + tag));
      });
      body.appendChild(tags);
    }

    body.appendChild(buildActions(article, publications));
    card.appendChild(body);
    return card;
  }

  var cards = data
    .sortByDate(data.all)
    .sort(function (a, b) {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return 0;
    })
    .map(function (article) {
      return { article: article, publications: safePublications(article) };
    })
    .filter(function (entry) {
      return entry.publications.length > 0;
    })
    .slice(0, MAX_CARDS);

  if (!cards.length) {
    grid.removeAttribute("data-articles-grid");
    return;
  }

  var fragment = document.createDocumentFragment();
  cards.forEach(function (entry) {
    fragment.appendChild(buildCard(entry.article, entry.publications));
  });

  grid.setAttribute("data-count", String(cards.length));
  grid.insertBefore(fragment, grid.firstChild);
})();
