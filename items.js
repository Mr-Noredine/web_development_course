// ═══════════════════════════════════════════════════════════
// ITEMS.JS - Chargement de items.json
// ═══════════════════════════════════════════════════════════

// Version synchrone avec fetch immédiat
(async function() {
  try {
    const response = await fetch('./items.json');
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Exposer globalement
    window.QUIZ_ITEMS = data;
    
    console.log('✓ items.json chargé:', data.items?.length || 0, 'exercices');
    
    // Déclencher un événement pour signaler que les données sont prêtes
    window.dispatchEvent(new Event('itemsLoaded'));
    
  } catch (error) {
    console.error('❌ Erreur chargement items.json:', error);
    
    // Définir un objet vide pour éviter les erreurs
    window.QUIZ_ITEMS = { items: [] };
    
    // Déclencher quand même l'événement
    window.dispatchEvent(new Event('itemsLoaded'));
  }
})();

// Promise pour attendre le chargement si nécessaire
window.itemsReady = new Promise((resolve) => {
  window.addEventListener('itemsLoaded', () => {
    resolve(window.QUIZ_ITEMS);
  }, { once: true });
});