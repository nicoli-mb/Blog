document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM carregado, iniciando...");
  
  // Variável para controlar se os posts já foram carregados
  let postsCarregados = false;
 
  // Função para carregar posts da API na página inicial
  function carregarPosts() {
    // Evita carregar posts múltiplas vezes
    if (postsCarregados) {
      console.log("Posts já foram carregados, ignorando...");
      return;
    }
    
    console.log("Tentando carregar posts...");
    
    const postsContainer = document.getElementById('posts-container');
    
    if (!postsContainer) {
      console.error("Container de posts não encontrado!");
      return;
    }
    
    // Mostra loading mais elegante
    postsContainer.innerHTML = `
      <div class="col-12 text-center" id="loading-message">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Carregando...</span>
        </div>
        <p class="mt-2">Carregando posts...</p>
      </div>
    `;
   
    fetch('https://api-fake-blog.onrender.com/postagens/')
      .then(response => {
        console.log("Resposta recebida:", response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(posts => {
        console.log("Posts recebidos:", posts);
        
        // Marca como carregado para evitar recarregamentos
        postsCarregados = true;
        
        // Pequeno delay para evitar "flash" visual
        setTimeout(() => {
          renderizarPosts(posts, postsContainer);
        }, 300);
       
      })
      .catch(error => {
        console.error('Erro ao carregar posts:', error);
        postsCarregados = true; // Marca como carregado mesmo com erro
        setTimeout(() => {
          mostrarPostsPadrao(postsContainer);
        }, 300);
      });
  }
  
  // Função separada para renderizar posts
  function renderizarPosts(posts, container) {
    // Cria fragment para melhor performance
    const fragment = document.createDocumentFragment();
    
    // Limita a 8 posts para manter o layout
    const postsLimitados = posts.slice(0, 8);
    
    postsLimitados.forEach((post, index) => {
      console.log("Criando post:", index + 1, post.title);
     
      const postElement = document.createElement('div');
      postElement.className = 'col-md-3 post';
      postElement.setAttribute('data-post-id', index + 1);
      
      // Adiciona classe para animação suave
      postElement.style.opacity = '0';
      postElement.style.transform = 'translateY(20px)';
      postElement.style.transition = 'all 0.3s ease';
     
      postElement.innerHTML = `
        <img src="${post.thumbImage}" alt="${post.thumbImageAltText}" 
             onerror="this.src='imagens/tecn.jpg'" 
             loading="lazy">
        <div class="post-texto">
          <p>${post.title}</p>
          <a href="#" class="btn btn-vermais" data-post-id="${index + 1}">VER MAIS</a>
        </div>
      `;
      
      fragment.appendChild(postElement);
    });
    
    // Substitui todo o conteúdo de uma vez
    container.innerHTML = '';
    container.appendChild(fragment);
    
    // Anima a entrada dos posts
    setTimeout(() => {
      const postElements = container.querySelectorAll('.post');
      postElements.forEach((post, index) => {
        setTimeout(() => {
          post.style.opacity = '1';
          post.style.transform = 'translateY(0)';
        }, index * 100); // Animação escalonada
      });
    }, 50);
    
    console.log("Posts renderizados, configurando cliques...");
    adicionarClickListeners();
  }
 
  // Função para mostrar posts padrão se a API falhar
  function mostrarPostsPadrao(container) {
    console.log("Mostrando posts padrão...");
    
    if (!container) {
      console.error("Container não encontrado para posts padrão!");
      return;
    }
    
    const postsData = [
      { id: 1, img: "imagens/paris.jpg", alt: "Post Paris", title: "Paris: A Cidade Luz Que Encanta em Cada Esquina" },
      { id: 2, img: "imagens/brasil.jpg", alt: "Post Brasil", title: "Brasil: Diversidade, Cores e Aventuras Tropicais" },
      { id: 3, img: "imagens/las vegas.jpg", alt: "Post Las Vegas", title: "Las Vegas: muito mais que cassinos. Descubra aventuras e paisagens únicas!" },
      { id: 4, img: "imagens/japão.jpg", alt: "Post Japão", title: "O Japão une tradição e modernidade como nenhum outro lugar no mundo." },
      { id: 5, img: "imagens/itália.jpg", alt: "Post Roma", title: "Roma é um verdadeiro museu a céu aberto. Uma viagem no tempo!" },
      { id: 6, img: "imagens/suiça.jpg", alt: "Post Alpes", title: "Conheça os Alpes Suíços: paisagens de tirar o fôlego e esportes radicais." },
      { id: 7, img: "imagens/inglaterra.jpg", alt: "Post Londres", title: "Londres: tradição britânica, moda e cultura pop em uma cidade vibrante." },
      { id: 8, img: "imagens/chile.jpg", alt: "Post Montanhas", title: "Refúgios nas montanhas: tranquilidade, ar puro e muito verde." }
    ];
    
    const fragment = document.createDocumentFragment();
    
    postsData.forEach((post, index) => {
      const postElement = document.createElement('div');
      postElement.className = 'col-md-3 post';
      postElement.setAttribute('data-post-id', post.id);
      
      postElement.style.opacity = '0';
      postElement.style.transform = 'translateY(20px)';
      postElement.style.transition = 'all 0.3s ease';
      
      postElement.innerHTML = `
        <img src="${post.img}" alt="${post.alt}" loading="lazy">
        <div class="post-texto">
          <p>${post.title}</p>
          <a href="#" class="btn btn-vermais" data-post-id="${post.id}">VER MAIS</a>
        </div>
      `;
      
      fragment.appendChild(postElement);
    });
    
    container.innerHTML = '';
    container.appendChild(fragment);
    
    // Anima a entrada
    setTimeout(() => {
      const postElements = container.querySelectorAll('.post');
      postElements.forEach((post, index) => {
        setTimeout(() => {
          post.style.opacity = '1';
          post.style.transform = 'translateY(0)';
        }, index * 100);
      });
    }, 50);
    
    adicionarClickListeners();
  }
 
  // Função para adicionar event listeners aos posts (com debounce)
  function adicionarClickListeners() {
    // Remove event listeners antigos se existirem
    const posts = document.querySelectorAll(".post");
    
    posts.forEach(post => {
      // Remove listener antigo se existir
      const newPost = post.cloneNode(true);
      post.parentNode.replaceChild(newPost, post);
    });
    
    // Adiciona novos listeners
    const newPosts = document.querySelectorAll(".post");
    
    newPosts.forEach(post => {
      post.addEventListener("click", handlePostClick, { once: false });
      
      // Adiciona listener específico para botões
      const button = post.querySelector('.btn-vermais');
      if (button) {
        button.addEventListener("click", handlePostClick, { once: false });
      }
    });
  }
  
  // Função separada para lidar com cliques (com debounce)
  let clickTimeout = null;
  
  function handlePostClick(e) {
    e.preventDefault();
    e.stopPropagation();
    
    // Debounce para evitar cliques múltiplos
    if (clickTimeout) {
      clearTimeout(clickTimeout);
    }
    
    clickTimeout = setTimeout(() => {
      const postElement = e.target.closest('.post');
      if (!postElement) return;
      
      const postId = postElement.getAttribute('data-post-id') || 
                    e.target.getAttribute('data-post-id');
      
      if (postId) {
        console.log("Navegando para post:", postId);
        window.location.href = `pagina2.html?postId=${postId}`;
      }
    }, 150);
  }
 
  // Função para carregar post específico na página 2
  function carregarPostEspecifico() {
    // Verifica se está na página 2
    if (!window.location.pathname.includes('pagina2.html')) {
      return;
    }
   
    console.log("Carregando post específico...");
   
    // Pega o ID do post da URL
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId') || '1';
   
    console.log("ID do post:", postId);
    
    // Mostra loading
    const titleElement = document.getElementById('post-title');
    const postContent = document.getElementById('post-content');
    
    if (titleElement) titleElement.textContent = 'Carregando...';
    if (postContent) postContent.innerHTML = '<div class="text-center"><div class="spinner-border" role="status"></div><p>Carregando conteúdo...</p></div>';
   
    fetch(`https://api-fake-blog.onrender.com/postagem/${postId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(post => {
        console.log("Post específico carregado:", post);
        
        setTimeout(() => {
          renderizarPostEspecifico(post);
        }, 300);
       
      })
      .catch(error => {
        console.error('Erro ao carregar post específico:', error);
        setTimeout(() => {
          mostrarConteudoPadrao();
        }, 300);
      });
  }
  
  // Função para renderizar post específico
  function renderizarPostEspecifico(post) {
    // Atualiza o título da página
    document.title = `Post - ${post.title}`;
   
    // Atualiza os elementos da página
    const titleElement = document.getElementById('post-title');
    if (titleElement) {
      titleElement.style.opacity = '0';
      setTimeout(() => {
        titleElement.textContent = post.title;
        titleElement.style.opacity = '1';
      }, 150);
    }
   
    // Atualiza a imagem
    const postImage = document.getElementById('post-image');
    if (postImage) {
      postImage.style.opacity = '0';
      setTimeout(() => {
        postImage.src = post.thumbImage;
        postImage.alt = post.thumbImageAltText;
        postImage.onerror = function() {
          this.src = 'imagens/tecn.jpg';
        };
        postImage.style.opacity = '1';
      }, 150);
    }
   
    // Atualiza o conteúdo
    const postContent = document.getElementById('post-content');
    if (postContent) {
      postContent.style.opacity = '0';
      setTimeout(() => {
        postContent.innerHTML = `
          <p><strong>📝 ${post.title}</strong><br>
          ${post.description}</p>
         
          <p><strong>✍️ Autor:</strong> ${post.profileName}<br>
          <strong>📅 Data:</strong> ${post.postDate}</p>
         
          <p><strong>💡 Sobre este artigo</strong><br>
          Este é um conteúdo atualizado automaticamente através da nossa API de notícias.
          Nosso sistema busca sempre trazer as informações mais relevantes e atualizadas para nossos leitores.</p>
         
          <p><strong>🌟 Continue Explorando</strong><br>
          Não deixe de conferir outros artigos em nosso blog para descobrir mais destinos incríveis,
          dicas de viagem e experiências únicas ao redor do mundo.</p>
        `;
        postContent.style.opacity = '1';
      }, 150);
    }
  }
 
  // Função para mostrar conteúdo padrão se a API falhar
  function mostrarConteudoPadrao() {
    const titleElement = document.getElementById('post-title');
    const postImage = document.getElementById('post-image');
    const postContent = document.getElementById('post-content');
    
    if (titleElement) {
      titleElement.style.opacity = '0';
      setTimeout(() => {
        titleElement.textContent = 'Paris: A Cidade Luz Que Encanta em Cada Esquina';
        titleElement.style.opacity = '1';
      }, 150);
    }
    
    if (postImage) {
      postImage.style.opacity = '0';
      setTimeout(() => {
        postImage.src = 'imagens/paris.jpg';
        postImage.alt = 'Paris';
        postImage.style.opacity = '1';
      }, 150);
    }
    
    if (postContent) {
      postContent.style.opacity = '0';
      setTimeout(() => {
        postContent.innerHTML = `
          <p>📍 <strong>Paris: Amor à Primeira Vista</strong><br>
           Paris é um dos destinos mais sonhados do mundo — e não é à toa. A capital da França mistura arte, moda, história e romantismo como nenhum outro lugar. Quem visita Paris pela primeira vez volta com aquela sensação de ter vivido um sonho acordado. E quem volta pela segunda, terceira (ou quarta!) vez, sempre descobre algo novo, porque Paris nunca cansa.</p>

          <p>✨ <strong>Primeiras Impressões</strong><br>
          Assim que você chega em Paris, é impossível não se encantar com os prédios antigos, as ruas arborizadas e o estilo dos parisienses. Há uma elegância natural em tudo: na arquitetura, nos cafés, nas vitrines das lojas e até no jeito de andar das pessoas.</p>
        `;
        postContent.style.opacity = '1';
      }, 150);
    }
  }
 
  // Adiciona estilos de transição via CSS
  const style = document.createElement('style');
  style.textContent = `
    #post-title, #post-image, #post-content {
      transition: opacity 0.3s ease;
    }
    
    .post {
      cursor: pointer;
    }
    
    .post:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    .spinner-border {
      color: #007bff;
    }
  `;
  document.head.appendChild(style);
 
  // Executa a função apropriada baseado na página atual
  console.log("Verificando página atual:", window.location.pathname);
 
  if (window.location.pathname.includes('pagina2.html')) {
    console.log("Detectada página 2");
    carregarPostEspecifico();
  } else {
    console.log("Detectada página inicial, carregando posts...");
    carregarPosts();
  }
});