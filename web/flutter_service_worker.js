'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "e399618e5d78e6a229e5438444ae8455",
"assets/assets/bandicoot.jpg": "9648f3d55777ca6d71a5f643dabb616a",
"assets/assets/bracketsterminal.PNG": "e52ca49522c6e563b7846d1a1c70c066",
"assets/assets/bush.jpg": "5d73d6ec7d3bdd0c6baeb1555022c0cd",
"assets/assets/canoes.jpg": "70df8174feb06e4f7303c98bf5989bec",
"assets/assets/coast.jpg": "0d9ec01348cda100144855122fd267b4",
"assets/assets/country.jpg": "ef8f1b233f50553f622f22787fec80ef",
"assets/assets/creek.jpg": "0789120e748c729ecd2355eaf2883359",
"assets/assets/ducks.jpg": "05cdd77ebd4b9c48a002de3dd63216a4",
"assets/assets/emu.jpg": "7d5411bd791f4433b67c19368d878633",
"assets/assets/grasstrees.jpg": "249451601a2bd6cad6a3708f0a3a60c3",
"assets/assets/heath.jpg": "2e6eda76ea165a99562c83414a7e55d7",
"assets/assets/hook.jpg": "003851c7c5822b067916aa98c1ff5b6d",
"assets/assets/hot.jpg": "17e788bb6d92fec0a1edbafd32894d9d",
"assets/assets/kangaroo.jpg": "036a307441ae135c35b365bc331d83ed",
"assets/assets/lorikeet.jpg": "da1dc97a8c8c8890b75fe642e3f67ea1",
"assets/assets/middens.jpg": "f3f37f95be5a535919c402533622b8bd",
"assets/assets/middle.jpg": "36ee13ff09ed8f2e8ccbd479f0441686",
"assets/assets/moretrees.jpg": "59b3ab561902dc61ead669b840e1eb39",
"assets/assets/ochres.jpg": "5fb71e9729e78405336afeebb67e3987",
"assets/assets/precol.jpg": "219dd397945e88b206e0a292a267c11e",
"assets/assets/rockface.jpg": "654c289dd9de5810938c69fd5d511a2c",
"assets/assets/rocktree.jpg": "8be2b8b3a3917ff116aba10e5a49a69e",
"assets/assets/scartree.jpg": "9685469d4aaa6cf61457efda579fe3b2",
"assets/assets/slope.jpg": "c75f4db2c6794884f36b34efafca8510",
"assets/assets/sunset.jpg": "afdbc1c9b57f607f630208f18c908593",
"assets/assets/travel.jpg": "6ffa634ebcb20302be894491e5e60bc2",
"assets/assets/view.jpg": "b110fd767cf661499619e6c22e3a4920",
"assets/assets/wasser.jpg": "570e44a8b5318b5a99953eea1591c7b5",
"assets/assets/water.jpg": "191f78e01f9e1d86ed4621f7e7fd5df1",
"assets/assets/yams.jpg": "2d9fe416d5083cf8287db9a8da781896",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/NOTICES": "138b6ee123ce968a821a732dc3437fd3",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"index.html": "6bc2a08e87f22f212b1ca1fbccacade8",
"/": "6bc2a08e87f22f212b1ca1fbccacade8",
"main.dart.js": "e97023679db89aa4930574e15ca82e39",
"manifest.json": "576349b2d71dacf917086055f4f91987",
"version.json": "4a76e446b711251311d925aa9db28afc"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
