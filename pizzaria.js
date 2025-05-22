// Dados iniciais
let usuarios = [
  { nome: "admin", numero: "admin", senhaHash: null, endereco: "admin" }
];
// Gerar hash para senha padrão admin
usuarios[0].senhaHash = hashSenha('admin');

let ingredientes = [
  { nome: "Queijo", preco: 3, tipo: "embutido" },
  { nome: "Presunto", preco: 3, tipo: "embutido" },
  { nome: "Calabresa", preco: 6, tipo: "complemento" },
  { nome: "Frango", preco: 5, tipo: "carne" },
  { nome: "Milho", preco: 3, tipo: "complemento" },
  { nome: "Cebola", preco: 3, tipo: "complemento" },
  { nome: "Tomate", preco: 3, tipo: "verdura" },
  { nome: "Azeitona", preco: 3, tipo: "complemento" },
  { nome: "Bacon", preco: 6, tipo: "complemento" },
  { nome: "Palmito", preco: 5, tipo: "verdura" },
  { nome: "Brócolis", preco: 5, tipo: "verdura" },
  { nome: "Cogumelo", preco: 7, tipo: "complemento" },
  { nome: "Ovo", preco: 4, tipo: "complemento" },
  { nome: "Peito de Peru", preco: 4, tipo: "embutido" },
  { nome: "Atum", preco: 6, tipo: "carne" },
  { nome: "Lombo", preco: 8, tipo: "carne" },
  { nome: "Costela", preco: 7, tipo: "carne" },
  { nome: "Ervilha", preco: 3, tipo: "complemento" },
  { nome: "Pimentão", preco: 3, tipo: "verdura" },
];

let pizzas = [];
let carrinho = [];
let usuarioLogado = null;
let editandoPizzaIndex = -1;

// Função simples para hashear senha (não é seguro para produção)
function hashSenha(s) {
  let hash = 0, i, chr;
  if (s.length === 0) return hash;
  for (i = 0; i < s.length; i++) {
    chr = s.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Converte para 32bits
  }
  return hash;
}

// Trocar seções do aplicativo, esconder todas e mostrar só a selecionada
function trocarsecao(secao) {
  const secoes = [
    "login",
    "principal",
    "cadastro",
    "esqueciminhaSenha",
    "menu",
    "cardapio",
    "gerenciapizza",
    "realizarpedido",
    "cadastrarpizza",
  ];

  secoes.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  });

  const secaoSelecionada = document.getElementById(secao);
  if (secaoSelecionada) secaoSelecionada.classList.remove("hidden");

  if (secao === "cardapio") atualizarCardapio();
  if (secao === "gerenciapizza") atualizarGerenciar();
  if (secao === "realizarpedido") atualizarPedido();
  if (secao === "cadastrarpizza") prepararCadastroPizza();
}

// Mostra mensagem e limpa após 4s
function mostrarMensagem(id, msg, cor) {
  const el = document.getElementById(id);
  if (!el) return;
  
  el.textContent = msg;
  el.style.color = cor || '#333';
  if (msg) {
    setTimeout(() => { el.textContent = ''; }, 4000);
  }
}

// Login
function logar() {
  let nome = document.getElementById("nome").value.trim();
  let senha = document.getElementById("senha").value.trim();

  if (!nome || !senha) {
    mostrarMensagem("avisoconecta", "Preencha todos os campos", "red");
    return;
  }

  let hash = hashSenha(senha);
  let usuario = usuarios.find(u => u.nome === nome && u.senhaHash === hash);

  if (usuario) {
    usuarioLogado = usuario;
    document.getElementById("nome").value = "";
    document.getElementById("senha").value = "";
    mostrarMensagem("avisoconecta", "Login realizado com sucesso", "green");
    trocarsecao("menu");
    toggleAdminButtons(nome === "admin");
  } else {
    mostrarMensagem("avisoconecta", "Nome ou senha incorretos", "red");
  }
}

function toggleAdminButtons(show) {
  const btnCadastrar = document.getElementById("btnCadastrarpizza");
  const btnGerenciar = document.getElementById("btnGerenciarpizzas");
  
  if (btnCadastrar && btnGerenciar) {
    if (show) {
      btnCadastrar.classList.remove("hidden");
      btnGerenciar.classList.remove("hidden");
    } else {
      btnCadastrar.classList.add("hidden");
      btnGerenciar.classList.add("hidden");
    }
  }
}

// Logout
function logout() {
  usuarioLogado = null;
  carrinho = [];
  editandoPizzaIndex = -1;
  toggleAdminButtons(false);
  trocarsecao("login");
}

// Cadastro de usuário
function cadastrar() {
  let nome = document.getElementById("usuario").value.trim();
  let numero = document.getElementById("numero").value.trim();
  let endereco = document.getElementById("endereco").value.trim();
  let senha = document.getElementById("senhac").value.trim();

  if (!nome || !numero || !endereco || !senha) {
    mostrarMensagem("avisocadastra", "Preencha todos os campos", "red");
    return;
  }

  if (usuarios.some(u => u.nome === nome || u.numero === numero)) {
    mostrarMensagem("avisocadastra", "Esse usuário já existe", "red");
    return;
  }

  usuarios.push({ nome, numero, endereco, senhaHash: hashSenha(senha) });
  mostrarMensagem("avisocadastra", "Cadastrado com sucesso!", "green");
  limparCadastro();
}

function limparCadastro() {
  document.getElementById("usuario").value = "";
  document.getElementById("numero").value = "";
  document.getElementById("endereco").value = "";
  document.getElementById("senhac").value = "";
}

// Esqueci senha
let usuarioEncontradoIndex = -1;

function buscarUsuario() {
  let nome = document.getElementById("nomeEsqueci").value.trim();
  usuarioEncontradoIndex = usuarios.findIndex(u => u.nome === nome);

  if (usuarioEncontradoIndex >= 0) {
    mostrarMensagem("avisoSenha", "Usuário encontrado! Digite a nova senha abaixo.", "green");
    document.getElementById("redefinirSenhaDiv").style.display = "block";
  } else {
    mostrarMensagem("avisoSenha", "Usuário não encontrado.", "red");
    document.getElementById("redefinirSenhaDiv").style.display = "none";
  }
}

function redefinirSenha() {
  let novaSenha = document.getElementById("novaSenha").value.trim();
  if (novaSenha.length < 2) {
    mostrarMensagem("avisoSenha", "Senha muito curta. Use pelo menos 2 caracteres.", "red");
    return;
  }
  if (usuarioEncontradoIndex >= 0) {
    usuarios[usuarioEncontradoIndex].senhaHash = hashSenha(novaSenha);
    mostrarMensagem("avisoSenha", "Senha redefinida com sucesso!", "green");
    document.getElementById("nomeEsqueci").value = "";
    document.getElementById("novaSenha").value = "";
    document.getElementById("redefinirSenhaDiv").style.display = "none";
    trocarsecao("login");
  }
}

// Atualiza o cardápio com filtro opcional
function atualizarCardapio(filtro = '') {
  const container = document.getElementById("listaCardapio");
  if (!container) return;
  
  container.innerHTML = "";
  let pizzasFiltradas = pizzas;
  
  if (filtro.trim() !== '') {
    const filtroMinusculo = filtro.toLowerCase();
    pizzasFiltradas = pizzas.filter(pizza => 
      pizza.nome.toLowerCase().includes(filtroMinusculo)
    );
  }
  
  if (pizzasFiltradas.length === 0) {
    container.innerHTML = "<p>Nenhuma pizza encontrada.</p>";
    return;
  }
  
  pizzasFiltradas.forEach(pizza => {
    const div = document.createElement("div");
    div.className = "pizza-item";
    div.innerHTML = `
      <img src="${pizza.imagem}" alt="Imagem da pizza ${pizza.nome}" class="pizza-img" loading="lazy" />
      <div class="pizza-info">
        <h3>${pizza.nome}</h3>
        <p><strong>Ingredientes:</strong> ${pizza.ingredientes.map(i => i.nome).join(", ")}</p>
        <p><strong>Preço:</strong> R$ ${pizza.preco.toFixed(2)}</p>
      </div>
    `;
    container.appendChild(div);
  });
}

// Função para filtrar o cardápio conforme texto digitado
function filtrarCardapio() {
  const input = document.getElementById("pesquisaPizza");
  if (!input) return;
  
  const valor = input.value || '';
  atualizarCardapio(valor);
}

// Atualização da tela para gerenciar pizzas
function atualizarGerenciar() {
  const container = document.getElementById("listaGerenciar");
  if (!container) return;
  
  container.innerHTML = "";
  if (pizzas.length === 0) {
    container.innerHTML = "<p>Nenhuma pizza cadastrada ainda.</p>";
    return;
  }
  
  pizzas.forEach((pizza, i) => {
    const div = document.createElement("div");
    div.className = "pizza-item-gerenciar";
    div.innerHTML = `
      <img src="${pizza.imagem}" alt="Imagem da pizza ${pizza.nome}" class="pizza-img" loading="lazy" />
      <div class="pizza-info">
        <h3>${pizza.nome}</h3>
        <p><strong>Ingredientes:</strong> ${pizza.ingredientes.map(ing => ing.nome).join(", ")}</p>
        <p><strong>Preço:</strong> R$ ${pizza.preco.toFixed(2)}</p>
      </div>
      <div class="flex-center" style="gap:0.5rem;">
        <button onclick="editarPizza(${i})" aria-label="Editar pizza ${pizza.nome}">Editar</button>
        <button onclick="excluirPizza(${i})" aria-label="Excluir pizza ${pizza.nome}">Excluir</button>
      </div>
    `;
    container.appendChild(div);
  });
}

function excluirPizza(index) {
  if (index < 0 || index >= pizzas.length) return;
  
  if (confirm(`Deseja realmente excluir a pizza "${pizzas[index].nome}"?`)) {
    pizzas.splice(index, 1);
    atualizarGerenciar();
    atualizarCardapio();
    atualizarPedido();
    prepararCadastroPizza();
  }
}

function editarPizza(index) {
  if (index < 0 || index >= pizzas.length) return;
  
  editandoPizzaIndex = index;
  const pizza = pizzas[index];
  document.getElementById("tituloCadastroPizza").textContent = "Editar Pizza";
  document.getElementById("nomePizza").value = pizza.nome;
  document.getElementById("imagemPizza").value = pizza.imagem;
  prepararCadastroPizza(pizza.ingredientes);
  document.getElementById("btnSalvarPizza").textContent = "Atualizar Pizza";
  trocarsecao("cadastrarpizza");
}

// Função para calcular e mostrar preço atual na criação/edição
function atualizarPrecoAtual() {
  const checkboxes = Array.from(document.querySelectorAll("#ingredientesPizza input[type=checkbox]:checked"));
  const selecionados = checkboxes.map(chk => ingredientes[parseInt(chk.value)]);
  const preco = selecionados.reduce((acc, ing) => acc + (ing?.preco || 0), 0);
  document.getElementById("precoAtualPizza").textContent = preco.toFixed(2);
}

function prepararCadastroPizza(ingredientesSelecionados = []) {
  const container = document.getElementById("ingredientesPizza");
  if (!container) return;
  
  container.innerHTML = "";

  ingredientes.forEach((ing, i) => {
    const label = document.createElement("label");
    const checked = ingredientesSelecionados.some(s => s.nome === ing.nome) ? "checked" : "";
    label.innerHTML = `
      <input type="checkbox" name="ingrediente" value="${i}" ${checked} />
      ${ing.nome} (R$ ${ing.preco.toFixed(2)})
    `;
    container.appendChild(label);
  });

  const inputs = container.querySelectorAll('input[type=checkbox]');
  inputs.forEach(input => {
    input.addEventListener('change', atualizarPrecoAtual);
  });

  atualizarPrecoAtual();
}

function cadastrarOuAtualizarPizza() {
  let nome = document.getElementById("nomePizza").value.trim();
  let imagem = document.getElementById("imagemPizza").value.trim();
  let checkboxes = Array.from(document.querySelectorAll("#ingredientesPizza input[type=checkbox]:checked"));
  let selecionados = checkboxes.map(chk => ingredientes[parseInt(chk.value)]);

  // Validações
  if (nome.length < 3) {
    alert("Nome da pizza deve ter pelo menos 3 caracteres.");
    return;
  }
  if (!imagem) {
    alert("Informe o link da imagem da pizza.");
    return;
  }
  if (!/^https?:\/\/.+/.test(imagem)) {
    alert("Informe uma URL válida para a imagem.");
    return;
  }
  if (selecionados.length === 0) {
    alert("Selecione pelo menos um ingrediente.");
    return;
  }
  if (selecionados.length > 7) {
    alert("Selecione no máximo 7 ingredientes.");
    return;
  }

  let preco = selecionados.reduce((acc, ing) => acc + (ing?.preco || 0), 0);

  if (editandoPizzaIndex < 0) {
    // Cadastrar nova pizza
    pizzas.push({ 
      nome, 
      imagem, 
      ingredientes: selecionados.filter(i => i), // Filtra valores undefined
      preco 
    });
    alert("Pizza cadastrada com sucesso!");
  } else {
    // Atualizar pizza existente
    pizzas[editandoPizzaIndex] = { 
      nome, 
      imagem, 
      ingredientes: selecionados.filter(i => i),
      preco 
    };
    alert("Pizza atualizada com sucesso!");
    editandoPizzaIndex = -1;
    document.getElementById("btnSalvarPizza").textContent = "Salvar Pizza";
    document.getElementById("tituloCadastroPizza").textContent = "Cadastrar Pizza";
  }

  prepararCadastroPizza();
  atualizarGerenciar();
  atualizarCardapio();
  trocarsecao("menu");
}

function atualizarPedido() {
  const container = document.getElementById("listaPedido");
  if (!container) return;
  
  container.innerHTML = "";
  if (pizzas.length === 0) {
    container.innerHTML = "<p>Nenhuma pizza disponível para pedido.</p>";
    return;
  }
  
  pizzas.forEach((pizza, i) => {
    const div = document.createElement("div");
    div.className = "pizza-item-pedido";
    div.innerHTML = `
      <img src="${pizza.imagem}" alt="Imagem da pizza ${pizza.nome}" class="pizza-img" loading="lazy" />
      <div class="pizza-info">
        <h3>${pizza.nome}</h3>
        <p><strong>Preço:</strong> R$ ${pizza.preco.toFixed(2)}</p>
      </div>
      <button onclick="adicionarPedido(${i})" aria-label="Adicionar pizza ${pizza.nome} ao pedido">Adicionar ao pedido</button>
    `;
    container.appendChild(div);
  });
  atualizarResumoPedido();
}

function adicionarPedido(index) {
  if (index < 0 || index >= pizzas.length) return;
  
  let pizza = pizzas[index];
  let item = carrinho.find(i => i.pizza.nome === pizza.nome);
  if (item) {
    item.quantidade++;
  } else {
    carrinho.push({ pizza, quantidade: 1 });
  }
  alert(`Pizza "${pizza.nome}" adicionada ao pedido.`);
  atualizarResumoPedido();
}

function atualizarResumoPedido() {
  const container = document.getElementById("resumoPedido");
  if (!container) return;
  
  container.innerHTML = "";
  if (carrinho.length === 0) {
    container.innerHTML = "<p>Nenhum item no pedido.</p>";
    return;
  }
  
  let total = 0;
  carrinho.forEach((item, i) => {
    let subtotal = item.pizza.preco * item.quantidade;
    total += subtotal;
    const div = document.createElement("div");
    div.className = "item-pedido";
    div.innerHTML = `
      <span>${item.pizza.nome} - Quantidade: ${item.quantidade} - Subtotal: R$ ${subtotal.toFixed(2)}</span>
      <button onclick="removerPedido(${i})" aria-label="Remover ${item.pizza.nome} do pedido">Remover</button>
    `;
    container.appendChild(div);
  });
  
  const totalDiv = document.createElement("div");
  totalDiv.className = "total-pedido";
  totalDiv.textContent = `Total: R$ ${total.toFixed(2)}`;
  container.appendChild(totalDiv);
}

function removerPedido(index) {
  if (index < 0 || index >= carrinho.length) return;
  carrinho.splice(index, 1);
  atualizarResumoPedido();
}

function finalizarPedido() {
  if (carrinho.length === 0) {
    alert("Seu pedido está vazio!");
    return;
  }
  
  // Mostrar resumo do pedido
  let mensagem = "Resumo do Pedido:\n";
  let total = 0;
  
  carrinho.forEach(item => {
    const subtotal = item.pizza.preco * item.quantidade;
    mensagem += `- ${item.pizza.nome} x${item.quantidade}: R$ ${subtotal.toFixed(2)}\n`;
    total += subtotal;
  });
  
  mensagem += `\nTotal: R$ ${total.toFixed(2)}\n\n`;
  mensagem += `Endereço de entrega: ${usuarioLogado?.endereco || 'Não informado'}`;
  
  if (confirm(`${mensagem}\n\nConfirmar pedido?`)) {
    alert("Pedido finalizado! Obrigado pela compra.");
    carrinho = [];
    atualizarResumoPedido();
    trocarsecao("menu");
  }
}

// Inicialização padrão
trocarsecao("login");
