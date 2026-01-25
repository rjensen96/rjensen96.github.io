import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
const blog = document.getElementById("blog");

fetch("blog.md")
  .then((response) => response.text())
  .then((text) => {
    blog.innerHTML = DOMPurify.sanitize(marked.parse(text));
  });
