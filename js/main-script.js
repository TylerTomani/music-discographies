// Temporary code to handle keyboard shortcuts for navigation links
import { keyboardNav } from "./nav/keyboard-nav.js";
const homelink = document.getElementById("homelink");
const backlink = document.getElementById("backlink");   
keyboardNav()
// addEventListener('keydown', e => {
//     let key = e.key.toLowerCase();
//     if (key === "h" || key === "home") {
//         e.preventDefault();
//         homelink.focus();
//     }
//     if (key === "b" || key === "back") {
//         e.preventDefault();
//         backlink.focus();
//     }
// });