var messages = [
    "FIRST POST",
    "DO WHAT YOU WANT 'COS A HACKER IS FREE, YOU ARE A HACKER",
    "ALL YOUR BASE ARE BELONG TO US",
    "PLACEHOLDER TEXT LOL",
    "THIS WAS A TRIUMPH. I'M MAKING A NOTE HERE, HUGE SUCCESS",
    "MONADONOMICON",
    "SEGMENTATION FAULT", 
    "I DO WHAT I WANT",
    "SUBTITLE GOES HERE",
    "I DID IT FOR TEH LULZ",
    "NERD LIFE: I'M LIVING IT",
    "PUSH POP CHANGE ORDER STACK FRAME FILO"
];
var randNum = Math.floor(Math.random() * messages.length);
document.getElementById("subtitle").innerHTML = messages[randNum];
