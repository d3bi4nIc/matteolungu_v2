/* ============================================
   SITE DATA LOADER
   Single source of truth = data.json (scris de panoul de admin).
   Expune:
     - window.siteDataReady : Promise care se rezolvă cu datele
     - window.SITE_DATA     : datele, după ce promisiunea s-a rezolvat
============================================ */

window.SITE_DATA = null;

window.siteDataReady = fetch('data.json', { cache: 'no-store' })
    .then(res => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
    })
    .then(data => {
        // Normalizează structura ca să nu pice randarea dacă lipsește ceva
        const safe = {
            shop: {
                ready: (data.shop && data.shop.ready) || [],
                custom: (data.shop && data.shop.custom) || []
            },
            gallery: data.gallery || [],
            packages: data.packages || []
        };
        window.SITE_DATA = safe;
        return safe;
    })
    .catch(err => {
        console.error('⚠️ Nu am putut încărca data.json:', err);
        const empty = { shop: { ready: [], custom: [] }, gallery: [], packages: [] };
        window.SITE_DATA = empty;
        return empty;
    });
