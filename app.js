(function () {
  // ========== Menu Mobile ==========
  const navToggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (navToggle && mobileMenu) {
    function toggleMenu(open) {
      const willOpen = typeof open === 'boolean' ? open : !mobileMenu.classList.contains('open');
      mobileMenu.classList.toggle('open', willOpen);
      navToggle.classList.toggle('active', willOpen);
      navToggle.setAttribute('aria-expanded', String(willOpen));
      navToggle.setAttribute('aria-label', willOpen ? 'Fechar menu' : 'Abrir menu');
    }

    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Fecha ao clicar em um link
    mobileMenu.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' && mobileMenu.classList.contains('open')) {
        toggleMenu(false);
      }
    });

    // Fecha ao clicar fora
    document.addEventListener('click', (e) => {
      if (
        !mobileMenu.contains(e.target) &&
        !navToggle.contains(e.target) &&
        mobileMenu.classList.contains('open')
      ) {
        toggleMenu(false);
      }
    });

    // Fecha com Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        toggleMenu(false);
        navToggle.focus();
      }
    });
  }
})();

// ========== Formatação de moeda ==========
const fmt = (n) => {
  try {
    return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } catch {
    return Number(n).toFixed(2);
  }
};

// ========== Alternância de tema ==========
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  const updateThemeButton = () => {
    const isDark = document.body.classList.contains('theme-dark');
    themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    themeToggle.textContent = isDark ? '☀️ Day' : '🌙 Night';
  };

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('theme-dark');
    updateThemeButton();
  });

  updateThemeButton();
}

// ========== Dados dos produtos ==========
const produtosData = [
  { id: 'saia-azul', nome: 'Saia e Oja azul', preco: 150.9, categoria: 'conjunto saia e oja', img: 'saia azul.webp', desc: 'Saia em Ankara, comprimento logo e rodado.' },
  { id: 'saia-verde', nome: 'Saia e Oja verde', preco: 150.9, categoria: 'conjunto saia e oja', img: 'saia verde.webp', desc: 'Saia em Ankara, comprimento logo e rodado.' },
  { id: 'saia-vermelha', nome: 'Saia e Oja vermelha', preco: 130.9, categoria: 'conjunto saia e oja', img: 'saia vermelha.webp', desc: 'Saia em oxford, comprimento logo e rodado.' },
  { id: 'saia-branca-laranja', nome: 'Saia em ankara com renda', preco: 120.9, categoria: 'saia de festa', img: 'saia branca e laranja.webp', desc: 'Saia em ankara com detalhes em renda.' },
  { id: 'saia-azul-amarelo', nome: 'Saia e Oja para festa', preco: 130.0, categoria: 'conjunto saia e oja', img: 'saia azul e amarelo.webp', desc: 'Saia em oxford, comprimento logo e rodado.' },
  { id: 'saia-mandala', nome: 'Saia, Oja e pano da costa', preco: 130.0, categoria: 'conjunto de festa completo', img: 'saia mandala.webp', desc: 'Saia, Oja e pano da costa, em oxford.' },
  { id: 'saia-triangulo', nome: 'saia, Oja e pano da costa', preco: 130.0, categoria: 'conjunto de festa completo', img: 'saia triangulo.webp', desc: 'Saia, Oja e pano da costa, em oxford.' },
  { id: 'saia-racao', nome: 'Saia de Ração branca', preco: 47.9, categoria: 'roupa de ração', img: 'saia de ração.webp', desc: 'Saia de ração, em oxford.' },
  { id: 'camisa', nome: 'Camisu de ração', preco: 35.9, categoria: 'roupa de ração', img: 'camisu.webp', desc: 'Camisu de ração, em oxford' },
  { id: 'bolinhas-azul', nome: 'Saia, oja e pano da costa', preco: 130.0, categoria: 'conjunto de festa completo', img: 'bolinhas azul.webp', desc: 'Saia, oja e pano da costa, em oxford.' }
];

// ========== Renderização de produtos ==========
const productsContainer = document.getElementById('products-list');
const resultsCount = document.getElementById('results-count');

function renderProdutos(lista) {
  if (!productsContainer) return;
  productsContainer.innerHTML = '';
  lista.forEach((p) => {
    const article = document.createElement('article');
    article.className = 'product-card';
    article.setAttribute('role', 'listitem');
    article.setAttribute('data-name', p.nome);
    article.setAttribute('data-price', p.preco);
    article.setAttribute('data-category', p.categoria);
    article.id = p.id;

    article.innerHTML = `
      <img src="${p.img}" alt="${p.nome}" loading="lazy">
      <div class="card-body">
        <h3 class="product-name">${p.nome}</h3>
        <p class="product-category">${p.categoria}</p>
        <p class="product-desc">${p.desc}</p>
        <div class="card-footer">
          <span class="price">R$ ${fmt(p.preco)}</span>
          <div style="display:flex;gap:.5rem;">
            <a class="btn small" href="produtos.html#${p.id}">Ver</a>
            <button class="btn small primary" onclick="adicionarAoCarrinhoPorId('${p.id}')">Adicionar</button>
          </div>
        </div>
      </div>
    `;
    productsContainer.appendChild(article);
  });
  if (resultsCount) {
    resultsCount.innerHTML = `Mostrando <strong>${lista.length}</strong> ${lista.length === 1 ? 'produto' : 'produtos'}`;
  }
}

renderProdutos(produtosData);

// ========== Filtro e ordenação ==========
const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sort');

function aplicarFiltroOrdenacao() {
  const termo = searchInput?.value.trim().toLowerCase() || '';
  let filtrados = produtosData.filter((p) =>
    p.nome.toLowerCase().includes(termo) ||
    p.categoria.toLowerCase().includes(termo) ||
    p.desc.toLowerCase().includes(termo)
  );

  const mode = sortSelect?.value;
  if (mode === 'price-asc') filtrados.sort((a, b) => a.preco - b.preco);
  if (mode === 'price-desc') filtrados.sort((a, b) => b.preco - a.preco);
  if (mode === 'name-asc') filtrados.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  if (mode === 'name-desc') filtrados.sort((a, b) => b.nome.localeCompare(a.nome, 'pt-BR'));

  renderProdutos(filtrados);
}

if (searchInput) searchInput.addEventListener('input', aplicarFiltroOrdenacao);
if (sortSelect) sortSelect.addEventListener('change', aplicarFiltroOrdenacao);

// ========== FAQ ==========
const faqItems = document.querySelectorAll('.faq-item');
const faqOpenAll = document.getElementById('faq-open-all');
const faqCloseAll = document.getElementById('faq-close-all');
const faqCounter = document.getElementById('faq-counter');

function updateFaqCounter() {
  if (!faqCounter) return;
  const abertas = Array.from(faqItems).filter((it) => it.classList.contains('open')).length;
  faqCounter.textContent = `${abertas} ${abertas === 1 ? 'aberta' : 'abertas'}`;
}

faqItems.forEach((item) => {
  const btn = item.querySelector('.faq-q');
  const answer = item.querySelector('.faq-a');
  if (!btn || !answer) return;

  answer.style.display = 'none';
  btn.setAttribute('aria-expanded', 'false');

  const toggle = () => {
    const isOpen = item.classList.toggle('open');
    answer.style.display = isOpen ? 'block' : 'none';
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    const ikon = btn.querySelector('.toggle-icon');
    if (ikon) ikon.textContent = isOpen ? '−' : '+';
    updateFaqCounter();
  };

  btn.addEventListener('click', toggle);
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  });
});

if (faqOpenAll) {
  faqOpenAll.addEventListener('click', () => {
    faqItems.forEach((item) => {
      const btn = item.querySelector('.faq-q');
      const answer = item.querySelector('.faq-a');
      item.classList.add('open');
      answer.style.display = 'block';
      btn.setAttribute('aria-expanded', 'true');
      const ikon = btn.querySelector('.toggle-icon');
      if (ikon) ikon.textContent = '−';
    });
    updateFaqCounter();
  });
}

if (faqCloseAll) {
  faqCloseAll.addEventListener('click', () => {
    faqItems.forEach((item) => {
      const btn = item.querySelector('.faq-q');
      const answer = item.querySelector('.faq-a');
      item.classList.remove('open');
      answer.style.display = 'none';
      btn.setAttribute('aria-expanded', 'false');
      const ikon = btn.querySelector('.toggle-icon');
      if (ikon) ikon.textContent = '+';
    });
    updateFaqCounter();
  });
}

updateFaqCounter();

// ========== Carrinho de Compras ==========
const CART_KEY = 'doum_cart_v1';
let cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');

(function createCartUI() {
  const btn = document.createElement('button');
  btn.id = 'cart-toggle-btn';
  btn.className = 'btn';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Abrir carrinho de compras');
  Object.assign(btn.style, {
    position: 'fixed',
    right: '18px',
    bottom: '18px',
    zIndex: '9999',
    padding: '12px 14px',
    borderRadius: '999px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    background: 'var(--accent)',
    color: '#fff',
    fontWeight: '700'
  });
  btn.textContent = '🛒';
  document.body.appendChild(btn);

  const panel = document.createElement('aside');
  panel.id = 'cart-panel';
  panel.setAttribute('aria-hidden', 'true');
  Object.assign(panel.style, {
    position: 'fixed',
    right: '18px',
    bottom: '76px',
    width: '340px',
    maxHeight: '70vh',
    overflow: 'auto',
    zIndex: '9999',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.12)',
    padding: '14px',
    display: 'none'
  });

  panel.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
      <strong>Seu Carrinho</strong>
      <button id="cart-close" class="btn small ghost" aria-label="Fechar carrinho">✕</button>
    </div>
    <div id="cart-items" style="display:flex;flex-direction:column;gap:.6rem;"></div>
    <div style="margin-top:10px; display:flex;justify-content:space-between;align-items:center;">
      <div style="font-weight:700">Total:</div>
      <div id="cart-total">R$ 0,00</div>
    </div>
    <div style="margin-top:10px; display:flex;gap:.5rem; justify-content:space-between;">
      <button id="cart-clear" class="btn ghost small">Limpar</button>
      <button id="checkout-btn" class="btn primary">Finalizar (WhatsApp)</button>
    </div>
  `;

  document.body.appendChild(panel);

  btn.addEventListener('click', toggleCart);
  panel.querySelector('#cart-close').addEventListener('click', closeCart);
  panel.querySelector('#cart-clear').addEventListener('click', () => {
    if (confirm('Deseja esvaziar o carrinho?')) {
      cart = [];
      saveCart();
      updateCartUI();
    }
  });
  panel.querySelector('#checkout-btn').addEventListener('click', checkout);
})();

function openCart() {
  const panel = document.getElementById('cart-panel');
  if (panel) {
    panel.style.display = 'block';
    panel.setAttribute('aria-hidden', 'false');
  }
}
function closeCart() {
  const panel = document.getElementById('cart-panel');
  if (panel) {
    panel.style.display = 'none';
    panel.setAttribute('aria-hidden', 'true');
  }
}
function toggleCart() {
  const panel = document.getElementById('cart-panel');
  if (panel && (panel.style.display === 'none' || panel.style.display === '')) {
    openCart();
  } else {
    closeCart();
  }
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
function loadCart() {
  cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}

// Funções públicas do carrinho
function adicionarAoCarrinhoPorId(prodId) {
  const prod = produtosData.find((p) => p.id === prodId);
  if (!prod) {
    alert('Produto não encontrado.');
    return;
  }
  addToCart({ id: prod.id, nome: prod.nome, preco: Number(prod.preco), qty: 1 });
}

function addToCart(item) {
  const exists = cart.find((ci) => ci.id === item.id);
  if (exists) {
    exists.qty = (exists.qty || 1) + (item.qty || 1);
  } else {
    cart.push({ ...item, qty: item.qty || 1 });
  }
  saveCart();
  updateCartUI();
  openCart();
}

function removeFromCart(prodId) {
  const idx = cart.findIndex((ci) => ci.id === prodId);
  if (idx !== -1) {
    cart.splice(idx, 1);
    saveCart();
    updateCartUI();
  }
}

function changeQty(prodId, qty) {
  const item = cart.find((ci) => ci.id === prodId);
  if (item) {
    item.qty = Math.max(1, qty);
    saveCart();
    updateCartUI();
  }
}

function updateCartUI() {
  const itemsContainer = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  if (!itemsContainer || !totalEl) return;

  itemsContainer.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    itemsContainer.innerHTML = '<div style="color:var(--muted);">Seu carrinho está vazio.</div>';
    totalEl.textContent = `R$ ${fmt(0)}`;
    return;
  }

  cart.forEach((item) => {
    const itemTotal = item.preco * (item.qty || 1);
    total += itemTotal;

    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.justifyContent = 'space-between';
    row.style.alignItems = 'center';
    row.style.gap = '.5rem';

    row.innerHTML = `
      <div style="flex:1; min-width:0;">
        <div style="font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${item.nome}</div>
        <div style="font-size:.9rem; color:var(--muted);">R$ ${fmt(item.preco)} x 
          <input type="number" min="1" value="${item.qty}" data-id="${item.id}" 
            style="width:54px; margin-left:6px; padding:4px; border-radius:6px; border:1px solid var(--border);">
        </div>
      </div>
      <div style="text-align:right;">
        <div style="font-weight:700">R$ ${fmt(itemTotal)}</div>
        <button class="btn small ghost" data-remove="${item.id}" style="margin-top:6px;">Remover</button>
      </div>
    `;

    itemsContainer.appendChild(row);

    row.querySelector('[data-remove]').addEventListener('click', () => removeFromCart(item.id));
    row.querySelector('input[type="number"]').addEventListener('change', (e) => {
      const v = parseInt(e.target.value) || 1;
      changeQty(item.id, v);
    });
  });

  totalEl.textContent = `R$ ${fmt(total)}`;
}

function checkout() {
  if (cart.length === 0) {
    alert('Seu carrinho está vazio.');
    return;
  }

  let mensagem = 'Olá! Gostaria de finalizar meu pedido:%0A%0A';
  let total = 0;

  cart.forEach((item) => {
    const subtotal = item.preco * (item.qty
