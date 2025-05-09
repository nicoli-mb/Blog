document.addEventListener("DOMContentLoaded", () => {
  const posts = document.querySelectorAll(".post");

  posts.forEach(post => {
    post.addEventListener("click", () => {
      window.location.href = "pagina2.html";
    });
  });
});

