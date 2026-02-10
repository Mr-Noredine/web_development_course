// categories.js
// Charge categories.json et expose window.QUIZ_CATEGORIES + window.categoriesReady

(() => {
  const scriptUrl = document.currentScript?.src
    ? new URL(document.currentScript.src, window.location.href)
    : new URL(window.location.href);

  const jsonUrl = new URL("./categories.json", scriptUrl);

  window.categoriesReady = fetch(jsonUrl.href)
    .then(r => {
      if (!r.ok) throw new Error(`categories.json introuvable (${r.status})`);
      return r.json();
    })
    .then(data => {
      window.QUIZ_CATEGORIES = data;
      return data;
    })
    .catch(err => {
      console.error("Erreur chargement categories.json:", err);
      window.QUIZ_CATEGORIES = { categories: [] };
      throw err;
    });
})();