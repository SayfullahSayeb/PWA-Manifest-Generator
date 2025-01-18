self.addEventListener('install', (event) => {
    console.log('Service Worker installed');
  });
  
  self.addEventListener('activate', (event) => {
    console.log('Service Worker activated');
  });
  
  self.addEventListener('fetch', (event) => {
    if (event.request.destination === 'document') {
      event.respondWith(
        (async () => {
          const response = await fetch(event.request);
          const text = await response.text();
          
          // Log response status to check if the fetch is successful
          console.log('Fetched:', event.request.url);
          
          // Inject the manifest link dynamically before the closing </head> tag
          const modifiedResponse = text.replace(
            '</head>',
            '<link rel="manifest" href="/manifest.json"></head>'
          );
  
          return new Response(modifiedResponse, {
            headers: response.headers,
          });
        })()
      );
    }
  });
  