/*!
 * Nightfall — a small, dependency-free syntax highlighter for the web.
 * Inspired by the shape of Prism, starry-night and Shiki, built from scratch.
 *
 * Usage:
 *   <script src="nightfall.js"></script>
 *   <script>Nightfall.highlightAll();</script>
 *
 * Or manually:
 *   Nightfall.highlight(code, "python") // -> HTML string
 *
 * License: MIT
 */
(function (global) {
  "use strict";

  // ---------------------------------------------------------------------
  // 1. Utilities
  // ---------------------------------------------------------------------

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // A grammar is an ordered array of [tokenType, pattern, options] triples.
  // Order matters: earlier rules win over later ones for the same text span.
  // pattern must be a RegExp WITHOUT the global flag (we add it internally).
  // options.inside lets a token be tokenized again with a nested grammar
  // (e.g. interpolation inside a template string).

  function normalizeRule(rule) {
    return {
      type: rule[0],
      pattern: rule[1],
      inside: rule[2] && rule[2].inside,
      greedy: rule[2] && rule[2].greedy,
    };
  }

  // Recursive-descent style tokenizer, same core idea as Prism's algorithm:
  // start with one big "plain" segment, then for every rule in the grammar,
  // scan every still-plain segment and slice out matches into typed tokens.
  function tokenize(code, grammar) {
    var tokens = [{ type: null, content: code }];

    grammar.forEach(function (rawRule) {
      var rule = normalizeRule(rawRule);
      var re = new RegExp(rule.pattern.source, rule.pattern.flags.replace(/g/g, "") + "g");

      for (var i = 0; i < tokens.length; i++) {
        var tok = tokens[i];
        if (tok.type !== null) continue; // already claimed by an earlier rule

        var text = tok.content;
        re.lastIndex = 0;
        var match = re.exec(text);
        if (!match || match[0] === "") continue;

        // Support a "capture group is the real match" pattern via group 1
        // when the regex defines exactly one capturing group and it's used
        // for lookbehind-less lookbehind emulation. We keep it simple:
        // the whole match[0] is treated as the token content.
        var pieces = [];
        var lastEnd = 0;
        re.lastIndex = 0;
        var m;
        while ((m = re.exec(text))) {
          if (m[0] === "") { re.lastIndex++; continue; }
          if (m.index > lastEnd) {
            pieces.push({ type: null, content: text.slice(lastEnd, m.index) });
          }
          var content = m[1] !== undefined && rule.useGroup ? m[1] : m[0];
          pieces.push({ type: rule.type, content: content, inside: rule.inside });
          lastEnd = m.index + m[0].length;
        }
        if (lastEnd < text.length) {
          pieces.push({ type: null, content: text.slice(lastEnd) });
        }

        if (pieces.length) {
          tokens.splice.apply(tokens, [i, 1].concat(pieces));
          i += pieces.length - 1;
        }
      }
    });

    return tokens;
  }

  function renderTokens(tokens) {
    return tokens
      .map(function (tok) {
        if (tok.type === null) return escapeHtml(tok.content);
        var inner = tok.inside
          ? renderTokens(tokenize(tok.content, tok.inside))
          : escapeHtml(tok.content);
        return '<span class="nf-' + tok.type + '">' + inner + "</span>";
      })
      .join("");
  }

  // ---------------------------------------------------------------------
  // 2. Language grammars
  // ---------------------------------------------------------------------

  var languages = {};

  // ---- shared fragments -------------------------------------------------
  var CLIKE_NUMBER = /\b0[xX][\da-fA-F]+\b|\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/;

  // ---- JavaScript / TypeScript -------------------------------------------
  languages.javascript = [
    ["comment", /\/\/.*|\/\*[\s\S]*?\*\//],
    ["string", /`(?:\\[\s\S]|\$\{[^}]*\}|[^`\\])*`|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'/],
    ["keyword", /\b(?:const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|class|extends|new|this|super|import|export|default|from|as|async|await|try|catch|finally|throw|typeof|instanceof|in|of|yield|static|get|set|null|undefined)\b/],
    ["boolean", /\b(?:true|false)\b/],
    ["number", CLIKE_NUMBER],
    ["function", /\b[A-Za-z_$][\w$]*(?=\s*\()/],
    ["class-name", /\b[A-Z][\w$]*\b/],
    ["operator", /=>|[=!<>]=?=?|\+\+?|--?|&&|\|\||[+\-*/%&|^~!?:]/],
    ["punctuation", /[{}[\]();,.]/],
  ];
  languages.typescript = languages.javascript;
  languages.js = languages.javascript;

  // ---- Python -------------------------------------------------------------
  languages.python = [
    ["comment", /#.*/],
    ["string", /(?:[rRbBfFuU]{1,2})?(?:"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')/],
    ["decorator", /@[A-Za-z_][\w.]*/],
    ["keyword", /\b(?:def|return|if|elif|else|for|while|break|continue|class|import|from|as|pass|try|except|finally|raise|with|lambda|yield|global|nonlocal|assert|del|is|in|not|and|or|async|await)\b/],
    ["boolean", /\b(?:True|False|None)\b/],
    ["number", CLIKE_NUMBER],
    ["function", /\b[A-Za-z_]\w*(?=\s*\()/],
    ["class-name", /\b[A-Z]\w*\b/],
    ["operator", /\*\*|\/\/|[=!<>]=?|[+\-*/%&|^~]=?/],
    ["punctuation", /[{}[\]();,:.]/],
  ];
  languages.py = languages.python;

  // ---- Bash ---------------------------------------------------------------
  languages.bash = [
    ["comment", /#.*/],
    ["string", /"(?:\\.|[^"\\\n])*"|'[^']*'/],
    ["variable", /\$\{[^}]+\}|\$[A-Za-z_]\w*|\$\d+|\$[@*#?$!]/],
    ["keyword", /\b(?:if|then|else|elif|fi|for|while|do|done|case|esac|function|in|return|exit|export|local|source)\b/],
    ["function", /\b(?:sudo|apt|apt-get|pip|pip3|python|python3|npm|node|git|curl|wget|echo|cd|ls|mkdir|rm|cp|mv|chmod|chown|grep|find|nmap|ssh|docker|systemctl)\b/],
    ["number", /\b\d+\b/],
    ["operator", /&&|\|\||[|&;><]/],
    ["punctuation", /[{}[\]()]/],
  ];
  languages.sh = languages.bash;
  languages.shell = languages.bash;

  // ---- JSON -----------------------------------------------------------------
  languages.json = [
    ["property", /"(?:\\.|[^"\\\n])*"(?=\s*:)/],
    ["string", /"(?:\\.|[^"\\\n])*"/],
    ["boolean", /\b(?:true|false)\b/],
    ["null", /\bnull\b/],
    ["number", CLIKE_NUMBER],
    ["punctuation", /[{}[\],:]/],
  ];

  // ---- CSS --------------------------------------------------------------
  languages.css = [
    ["comment", /\/\*[\s\S]*?\*\//],
    ["string", /"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'/],
    ["selector", /(?:^|[\s{}])[.#]?[A-Za-z][\w-]*(?=\s*\{)|::?[A-Za-z-]+(?=[\s,{:])/],
    ["property", /(?:^|[\s{;])([\w-]+)(?=\s*:)/],
    ["important", /!important\b/],
    ["number", /-?\d+(?:\.\d+)?(?:px|em|rem|%|vh|vw|s|ms)?/],
    ["hexcolor", /#[0-9a-fA-F]{3,8}\b/],
    ["punctuation", /[{}();:,]/],
  ];

  // ---- HTML / XML ---------------------------------------------------------
  languages.markup = [
    ["comment", /<!--[\s\S]*?-->/],
    ["doctype", /<!DOCTYPE[^>]*>/i],
    ["tag-open", /<\/?[A-Za-z][\w-]*/],
    ["attribute-name", /\b[A-Za-z-]+(?=\s*=)/],
    ["attribute-value", /"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'/],
    ["tag-close", /\/?>/],
    ["punctuation", /[<>=]/],
  ];
  languages.html = languages.markup;
  languages.xml = languages.markup;

  // ---------------------------------------------------------------------
  // 3. Public API
  // ---------------------------------------------------------------------

  function highlight(code, lang) {
    var grammar = languages[(lang || "").toLowerCase()];
    if (!grammar) return escapeHtml(code);
    return renderTokens(tokenize(code, grammar));
  }

  function buildLineNumbers(html) {
    var lines = html.split("\n");
    return lines
      .map(function (line) {
        return '<span class="nf-line">' + (line === "" ? " " : line) + "</span>";
      })
      .join("\n");
  }

  function highlightElement(el) {
    var lang = (el.getAttribute("data-lang") || el.className.match(/language-(\w+)/) || [, "text"])[1];
    var code = el.textContent;
    var html = highlight(code, lang);
    if (el.hasAttribute("data-line-numbers")) {
      html = buildLineNumbers(html);
      el.classList.add("nf-line-numbers");
    }
    el.innerHTML = html;
    el.classList.add("nf-highlighted", "nf-lang-" + (lang || "text"));
  }

  function highlightAll(selector) {
    var nodes = document.querySelectorAll(selector || "pre code[data-lang], code[class*='language-']");
    nodes.forEach(highlightElement);
  }

  global.Nightfall = {
    highlight: highlight,
    highlightElement: highlightElement,
    highlightAll: highlightAll,
    languages: languages,
    registerLanguage: function (name, grammar) {
      languages[name.toLowerCase()] = grammar;
    },
  };
})(typeof window !== "undefined" ? window : this);
