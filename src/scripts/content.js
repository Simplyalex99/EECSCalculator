(async () => {
  const src = chrome.extension.getURL("/scripts/main.js");
  const { main } = await import(src);
  main();
})();
