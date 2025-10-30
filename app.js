
(function () {
  
  const btn = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');


  if (!btn || !nav) return;

  function toggleNav(open) {
    const willOpen = (typeof open === 'boolean') ? open : !nav.classList.contains('open');
    nav.classList.toggle('open', willOpen);
    btn.setAttribute('aria-expanded', String(willOpen));
    btn.setAttribute('aria-label', willOpen ? 'Fechar menu' : 'Abrir menu');
  }


  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleNav();
  });

  
  nav.addEventListener('click', (e) => {
    const target = e.target;
    if (target && target.tagName === 'A' && nav.classList.contains('open')) {
      toggleNav(false);
    }
  });

  
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !btn.contains(e.target) && nav.classList.contains('open')) {
      toggleNav(false);
    }
  });

  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      toggleNav(false);
      btn.focus();
    }
  });

  
  window.closeMainNav = () => toggleNav(false);
})();



const fmt = (n) => {
  try { return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  catch { return Number(n).toFixed(2); }
}



const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  const updateThemeButton = () => {
    const dark = document.body.classList.contains('theme-dark');
    themeToggle.setAttribute('aria-pressed', dark ? 'true' : 'false');
    themeToggle.textContent = dark ? '☀️Day' : '🌙Night';
  };
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('theme-dark');
    updateThemeButton();
  });
  updateThemeButton();
}



const produtosData = [
  { id: 'saia-azul', nome: 'Saia e Oja azul', preco: 150.90, categoria: 'conjunto saia e oja', img: 'saia azul.webp', desc: 'Saia em Ankara, comprimento logo e rodado.' },
  { id: 'saia-verde', nome: 'Saia e Oja verde', preco: 150.90, categoria: 'conjunto saia e oja', img: 'saia verde.webp', desc: 'Saia em Ankara, comprimento logo e rodado.' },
  { id: 'saia-vermelha', nome: 'Saia e Oja vermelha', preco: 130.90, categoria: 'conjunto saia e oja', img: 'saia vermelha.webp', desc: 'Saia em oxford, comprimento logo e rodado.' },
  { id: 'saia-branca-laranja', nome: 'Saia em ankara com renda', preco: 120.90, categoria: 'saia de festa', img: 'saia branca e laranja.webp', desc: 'Saia em ankara com detalhes em renda.' },
  { id: 'saia-azul-amarelo', nome: 'Saia e Oja para festa', preco: 130.00, categoria: 'conjunto saia e oja', img: 'saia azul e amarelo.webp', desc: 'Saia em oxford, comprimento logo e rodado.' },
  { id: 'saia-mandala', nome: 'Saia, Oja e pano da costa', preco: 130.00, categoria: 'conjunto de festa completo', img: 'saia mandala.webp', desc: 'Saia, Oja e pano da costa, em oxford.' },
  { id: 'saia-triangulo', nome: 'saia, Oja e pano da costa', preco: 130.00, categoria: 'conjunto de festa completo', img: 'saia triangulo.webp', desc: 'Saia, Oja e pano da costa, em oxford.' },
  { id: 'saia-racao', nome: 'Saia de Ração branca', preco: 47.90, categoria: 'roupa de ração', img: 'saia de ração.webp', desc: 'Saia de ração, em oxford.' },
  { id: 'camisa', nome: 'Camisu de ração', preco: 35.90, categoria: 'roupa de ração', img: 'camisu.webp', desc: 'Camisu de ração, em oxford' },
  { id: 'bolinhas-azul', nome: 'Saia, oja e pano da costa', preco: 130.00, categoria: 'conjunto de festa completo', img: 'bolinhas azul.webp', desc: 'Saia, oja e pano da costa, em oxford.' }
];


const productsContainer = document.getElementById('products-list');
const resultsCount = document.getElementById('results-count');


function renderProdutos(lista) {
  if (!productsContainer) return;
  productsContainer.innerHTML = '';
  lista.forEach(p => {
    const article = document.createElement('article');
    article.className = 'product-card';
    article.setAttribute('role', 'listitem');
    article.setAttribute('data-name', p.nome);
    article.setAttribute('data-price', p.preco);
    article.setAttribute('data-category', p.categoria);
    article.id = p.id;

    article.innerHTML = `
      <img src="${p.img}" alt="${p.nome}">
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
  if (resultsCount) resultsCount.innerHTML = `Mostrando <strong>${lista.length}</strong> ${lista.length === 1 ? 'produto' : 'produtos'}`;
}


renderProdutos(produtosData);


const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sort');

function aplicarFiltroOrdenacao() {
  const termo = searchInput ? searchInput.value.trim().toLowerCase() : '';
  let filtrados = produtosData.filter(p =>
    p.nome.toLowerCase().includes(termo) ||
    p.categoria.toLowerCase().includes(termo) ||
    p.desc.toLowerCase().includes(termo)
  );

  if (sortSelect) {
    const mode = sortSelect.value;
    if (mode === 'price-asc') filtrados.sort((a,b)=>a.preco-b.preco);
    if (mode === 'price-desc') filtrados.sort((a,b)=>b.preco-a.preco);
    if (mode === 'name-asc') filtrados.sort((a,b)=>a.nome.localeCompare(b.nome,'pt-BR'));
    if (mode === 'name-desc') filtrados.sort((a,b)=>b.nome.localeCompare(a.nome,'pt-BR'));
  }

  renderProdutos(filtrados);
}

if (searchInput) searchInput.addEventListener('input', aplicarFiltroOrdenacao);
if (sortSelect) sortSelect.addEventListener('change', aplicarFiltroOrdenacao);


const faqItems = document.querySelectorAll('.faq-item');
const faqOpenAll = document.getElementById('faq-open-all');
const faqCloseAll = document.getElementById('faq-close-all');
const faqCounter = document.getElementById('faq-counter');

function updateFaqCounter() {
  if (!faqCounter) return;
  const abertas = Array.from(faqItems).filter(it => it.classList.contains('open')).length;
  faqCounter.textContent = `${abertas} ${abertas === 1 ? 'aberta' : 'abertas'}`;
}

faqItems.forEach(item => {
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
  btn.addEventListener('keydown', e => { if (e.key==='Enter'||e.key===' ') { e.preventDefault(); toggle(); } });
});

if (faqOpenAll) faqOpenAll.addEventListener('click', () => {
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    item.classList.add('open');
    answer.style.display = 'block';
    btn.setAttribute('aria-expanded','true');
    const ikon = btn.querySelector('.toggle-icon'); if (ikon) ikon.textContent='−';
  });
  updateFaqCounter();
});

if (faqCloseAll) faqCloseAll.addEventListener('click', () => {
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    item.classList.remove('open');
    answer.style.display = 'none';
    btn.setAttribute('aria-expanded','false');
    const ikon = btn.querySelector('.toggle-icon'); if (ikon) ikon.textContent='+';
  });
  updateFaqCounter();
});

updateFaqCounter();



const CART_KEY = 'doum_cart_v1';
let cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');


(function createCartUI() {
 
  const btn = document.createElement('button');
  btn.id = 'cart-toggle-btn';
  btn.className = 'btn';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Abrir carrinho de compras');
  btn.style.position = 'fixed';
  btn.style.right = '18px';
  btn.style.bottom = '18px';
  btn.style.zIndex = 9999;
  btn.style.padding = '12px 14px';
  btn.style.borderRadius = '999px';
  btn.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
  btn.style.background = 'var(--accent)';
  btn.style.color = '#fff';
  btn.style.fontWeight = 700;
  btn.textContent = '🛒';
  document.body.appendChild(btn);


  const panel = document.createElement('aside');
  panel.id = 'cart-panel';
  panel.setAttribute('aria-hidden', 'true');
  panel.style.position = 'fixed';
  panel.style.right = '18px';
  panel.style.bottom = '76px';
  panel.style.width = '340px';
  panel.style.maxHeight = '70vh';
  panel.style.overflow = 'auto';
  panel.style.zIndex = 9999;
  panel.style.background = 'var(--surface)';
  panel.style.border = '1px solid var(--border)';
  panel.style.borderRadius = '12px';
  panel.style.boxShadow = '0 20px 50px rgba(0,0,0,0.12)';
  panel.style.padding = '14px';
  panel.style.display = 'none'; // inicialmente fechado

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

 
  btn.addEventListener('click', () => toggleCart());
  const closeBtn = panel.querySelector('#cart-close');
  closeBtn.addEventListener('click', () => closeCart());
  const clearBtn = panel.querySelector('#cart-clear');
  clearBtn.addEventListener('click', () => {
    if (!confirm('Deseja esvaziar o carrinho?')) return;
    cart = [];
    saveCart();
    updateCartUI();
  });

  const checkoutBtn = panel.querySelector('#checkout-btn');
  checkoutBtn.addEventListener('click', () => checkout());
})();

function openCart() {
  const panel = document.getElementById('cart-panel');
  if (!panel) return;
  panel.style.display = 'block';
  panel.setAttribute('aria-hidden', 'false');
}
function closeCart() {
  const panel = document.getElementById('cart-panel');
  if (!panel) return;
  panel.style.display = 'none';
  panel.setAttribute('aria-hidden', 'true');
}
function toggleCart() {
  const panel = document.getElementById('cart-panel');
  if (!panel) return;
  if (panel.style.display === 'none' || panel.style.display === '') openCart();
  else closeCart();
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
function loadCart() {
  cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}


function adicionarAoCarrinhoPorId(prodId) {
  const prod = produtosData.find(p => p.id === prodId);
  if (!prod) {
    alert('Produto não encontrado.');
    return;
  }
  addToCart({ id: prod.id, nome: prod.nome, preco: Number(prod.preco), qty: 1 });
}


function addToCart(item) {
  const exists = cart.find(ci => ci.id === item.id);
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
  const idx = cart.findIndex(ci => ci.id === prodId);
  if (idx === -1) return;
  cart.splice(idx, 1);
  saveCart();
  updateCartUI();
}

/* altera quantidade */
function changeQty(prodId, qty) {
  const item = cart.find(ci => ci.id === prodId);
  if (!item) return;
  item.qty = Math.max(1, qty);
  saveCart();
  updateCartUI();
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

  cart.forEach(item => {
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
        <div style="font-size:.9rem; color:var(--muted);">R$ ${fmt(item.preco)} x <input type="number" min="1" value="${item.qty}" data-id="${item.id}" style="width:54px; margin-left:6px; padding:4px; border-radius:6px; border:1px solid var(--border);"></div>
      </div>
      <div style="text-align:right;">
        <div style="font-weight:700">R$ ${fmt(itemTotal)}</div>
        <button class="btn small ghost" data-remove="${item.id}" style="margin-top:6px;">Remover</button>
      </div>
    `;

    itemsContainer.appendChild(row);

   
    const remBtn = row.querySelector('[data-remove]');
    remBtn.addEventListener('click', () => {
      removeFromCart(item.id);
    });

    const qtyInput = row.querySelector('input[type="number"]');
    qtyInput.addEventListener('change', (e) => {
      const v = parseInt(e.target.value) || 1;
      changeQty(item.id, v);
    });
  });

  totalEl.textContent = `R$ ${fmt(total)}`;
}


function checkout() {
  if (!cart || cart.length === 0) {
    alert('Seu carrinho está vazio.');
    return;
  }

  let mensagem = 'Olá! Gostaria de finalizar meu pedido:%0A%0A';
  let total = 0;

  cart.forEach(item => {
    const subtotal = item.preco * (item.qty || 1);
    mensagem += `• ${item.nome} — ${item.qty} x R$ ${fmt(item.preco)} = R$ ${fmt(subtotal)}%0A`;
    total += subtotal;
  });

  mensagem += `%0ATotal: R$ ${fmt(total)}%0A%0APor favor, me informe prazo de produção e formas de pagamento.`;

  
  const telefone = '5511966753014';
  const url = `https://wa.me/${telefone}?text=${mensagem}`;

  
  window.open(url, '_blank');
}


(function initCartOnLoad() {
  loadCart();
  updateCartUI();
})();


window.adicionarAoCarrinhoPorId = adicionarAoCarrinhoPorId;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
