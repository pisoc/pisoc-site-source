s = 's';
e = 'e';
var motds = [
    {
      s: "DO WHAT YOU WANT 'COS A HACKER IS FREE",
      e: "https://www.youtube.com/watch?v=zHcKn62X9vo"
    },
    {
      s: "ALL YOUR BASE ARE BELONG TO US",
      e: "https://www.youtube.com/watch?v=8fvTxv46ano"
    },
    {
      s: "TEST POST PLEASE IGNORE",
      e: "https://www.google.com/search?q=test+post+please+ignore"
    },
    {
      s: "THIS WAS A TRIUMPH",
      e: "https://www.youtube.com/watch?v=Y6ljFaKRTrI"
    },
    {
      s: "MONADONOMICON",
      e: "https://wiki.haskell.org/Monad"
    },
    {
      s: "SEGMENTATION FAULT",
      e: "https://en.wikipedia.org/wiki/Segmentation_fault"
    },
    {
      s: "I DO WHAT I WANT",
      e: "/img/2020/idwiw.jpg"
    },
    {
      s: "I DID IT FOR THE LULZ",
      e: "/img/2020/idiftl.jpg"
    },
    {
      s: "NERD LIFE? YOU LIVE IN IT",
      e: "https://www.youtube.com/watch?v=Op1i0B8-dJA"
    },
    {
      s: "PUSH POP CHANGE ORDER STACK FRAME FILO",
      e: "https://www.youtube.com/watch?v=rjigODNy3jk"
    },
];
var motd = motds[Math.floor(Math.random() * motds.length)];
var link = `<a href="${motd.e}">${motd.s}</a>`
document.getElementById("subtitle").innerHTML = link;