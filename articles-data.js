/* ============================================================
   DEVSPIREHUB PUBLICATION DATA
   Central source for published articles. Shared by the homepage
   showcase and the future /articles/ directory.

   One record per article. Multiple external publications live in
   the `publications` array so the same article is never duplicated.

   Only verified, published articles belong here. Never add
   placeholder links, invented dates, or draft records.
   ============================================================ */
(function (global) {
  "use strict";

  var articles = [
    {
      id: "claude-ai-one-day",
      title: "How to Learn Claude AI in One Day: A Practical Guide for Developers",
      description: "A practical, hands-on path to learning Claude AI in a single day, from core concepts and prompting to building your first working workflow.",
      featured: true,
      accent: "teal",
      category: "Applied AI",
      tags: ["AI", "Claude", "Developer Guide"],
      publishedDate: "2026-11-13T14:06:49Z",
      coverImage: "images/articles/claude-ai-one-day.webp",
      readingTime: 5,
      publications: [
        {
          platform: "devto",
          label: "DEV.to",
          url: "https://dev.to/devspirehub/how-to-learn-claude-ai-in-one-day-a-practical-guide-for-developers-4655"
        },
        {
          platform: "medium",
          label: "Medium",
          url: "https://medium.com/@devspirehub.website/how-to-learn-claude-ai-in-one-day-a-practical-guide-for-developers-b9bdc5c01d4a"
        }
      ]
    },
    {
      id: "devspirehub-devspire-nexus",
      title: "Introducing DevSpireHub & DevSpire Nexus - Two Platforms for Learning and Discovering Technology",
      description: "An introduction to DevSpireHub and DevSpire Nexus, two platforms built to make technology learning practical, accessible, and easy to discover.",
      featured: false,
      accent: "orange",
      category: "Announcement",
      tags: ["DevSpireHub", "Technology", "Community"],
      publishedDate: "2026-11-13T04:28:20Z",
      coverImage: "images/articles/devspirehub-nexus-intro.webp",
      readingTime: 3,
      publications: [
        {
          platform: "devto",
          label: "DEV.to",
          url: "https://dev.to/devspirehub/introducing-devspirehub-devspire-nexus-two-platforms-for-learning-and-discovering-technology-2ibk"
        }
      ]
    }
  ];

  function freezePublication(publication) {
    return Object.freeze({
      platform: publication.platform,
      label: publication.label,
      url: publication.url
    });
  }

  function freezeArticle(article) {
    return Object.freeze({
      id: article.id,
      title: article.title,
      description: article.description,
      featured: article.featured,
      accent: article.accent,
      category: article.category,
      tags: Object.freeze(article.tags.slice()),
      publishedDate: article.publishedDate,
      coverImage: article.coverImage,
      readingTime: article.readingTime,
      publications: Object.freeze(article.publications.map(freezePublication))
    });
  }

  var frozenArticles = Object.freeze(articles.map(freezeArticle));

  global.DevSpireArticles = Object.freeze({
    all: frozenArticles,
    sortByDate: function (list) {
      return list.slice().sort(function (a, b) {
        return Date.parse(b.publishedDate) - Date.parse(a.publishedDate);
      });
    },
    byId: function (id) {
      for (var i = 0; i < frozenArticles.length; i += 1) {
        if (frozenArticles[i].id === id) return frozenArticles[i];
      }
      return null;
    }
  });
})(window);
