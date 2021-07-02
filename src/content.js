(async () => {
  const src = chrome.extension.getURL("main.js");
  const { main } = await import(src);
  main();
})();
