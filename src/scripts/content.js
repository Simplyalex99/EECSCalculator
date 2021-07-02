/*
@Note: self calling async function that treats external js file main.js as a module in other to use keyword import.
main.js files contains a main function to handle all the code logic and use other modules.
*/
(async () => {
  const src = chrome.extension.getURL("/scripts/main.js");
  const { main } = await import(src);
  main();
})();
