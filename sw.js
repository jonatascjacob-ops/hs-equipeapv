const CACHE_NAME = 'apv-hora-silenciosa-v1';
const ASSETS = [
    './',
    './index.html',
    './favicon.png',
    'https://cdn.tailwindcss.com',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

// Instalação do Service Worker e Caching dos ficheiros e CDN
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Criando a base de dados em cache para offline...');
            return cache.addAll(ASSETS);
        }).then(() => self.skipWaiting())
    );
});

// Limpeza de caches antigas e activação
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Interceção de pedidos de rede e carregamento de Cache com Fallback
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            // Se encontrar o ficheiro em cache (mesmo offline), serve ele!
            if (cachedResponse) {
                return cachedResponse;
            }
            // Caso contrário, tenta ir buscar à rede
            return fetch(event.request);
        })
    );
});