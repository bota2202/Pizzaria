let usuarios=[
    {nome:"admin",numero:"admin",senha:"admin",endereco:"admin"}
]
function trocarsecao(secao){
    document.getElementById("login").style.display="none";
    document.getElementById("principal").style.display="none";
    document.getElementById("cadastro").style.display="none";
    document.getElementById("esqueciminhaSenha").style.display="none";


    document.getElementById(secao).style.display="block";
}
function logar(){
    let nome = document.getElementById("nome").value;
    let senha = document.getElementById("senha").value;
    if(nome == "" || senha == ""){
        document.getElementById("avisoconecta").textContent = "Preencha todos os campos";
        document.getElementById("avisoconecta").style.color = "red"; 
        return;
    }
    var achou = false;
    for(let i = 0; i < usuarios.length; i++){
        if(usuarios[i].nome == nome && usuarios[i].senha == senha){
            achou = true;
            break;
        }
    }
    if(achou){
        document.getElementById("nome").value = "";
        document.getElementById("senha").value = "";
        document.getElementById("avisoconecta").textContent = "Login realizado com sucesso";
        document.getElementById("avisoconecta").style.color = "green";
        trocarsecao('menu')
    } else {
        document.getElementById("avisoconecta").textContent = "Nome ou senha incorretos";
        document.getElementById("avisoconecta").style.color = "red"; 
    }
}
function cadastrar(){
    let nome=document.getElementById("usuario").value
    let numero=document.getElementById("numero").value
    let endereco=document.getElementById("endereco").value
    let senha=document.getElementById("senhac").value
    if(senha=="" || endereco=="" || numero=="" || nome==""){
        document.getElementById('avisocadastra').textContent="Preencha todos os campos"
        document.getElementById("avisocadastra").style.color="red"; 
    }else{
        var existe = false;
    for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].nome == nome || usuarios[i].numero==numero) {
        existe = true;
        }
    }
    if(existe==true){
        document.getElementById('avisocadastra').textContent="Esse usuário já existe"
        document.getElementById("avisocadastra").style.color="red"; 
    }else {
        var novo = {
        nome: nome,
        numero: numero,
        endereco: endereco,
        senha: senha
        };
        usuarios.push(novo);
        document.getElementById("avisocadastra").innerText = "Cadastrado com sucesso!";
        document.getElementById("avisocadastra").style.color="green"; 
        document.getElementById("usuario").value=""
        numero=document.getElementById("numero").value=""
        endereco=document.getElementById("endereco").value=""
        senha=document.getElementById("senhac").value=""
        document.getElementById("voltarpraconecta").style.display="block"
    }
    }
}
var usuarioEncontradoIndex = -1;

function buscarUsuario() {
    var nome = document.getElementById("nomeEsqueci").value;
    usuarioEncontradoIndex = -1;
    for (var i = 0; i < usuarios.length; i++) {
      if (usuarios[i].nome == nome) {
        usuarioEncontradoIndex = i;
        break;
      }
    }
    if (usuarioEncontradoIndex >= 0) {
      document.getElementById("avisoSenha").textContent = "Usuário encontrado! Digite a nova senha abaixo.";
      document.getElementById("avisoSenha").style.color = "green";
      document.getElementById("redefinirSenhaDiv").style.display = "block";
    } else {
      document.getElementById("avisoSenha").textContent = "Usuário não encontrado.";
      document.getElementById("avisoSenha").style.color = "red";
      document.getElementById("redefinirSenhaDiv").style.display = "none";
    }
}
function redefinirSenha() {
    var novaSenha = document.getElementById("novaSenha").value;
    if (novaSenha.length < 2) {
      document.getElementById("avisoSenha").textContent = "Senha muito curta. Use pelo menos 2 caracteres.";
      document.getElementById("avisoSenha").style.color = "red";
      return;
    }
    if (usuarioEncontradoIndex >= 0) {
      usuarios[usuarioEncontradoIndex].senha = novaSenha;
      document.getElementById("avisoSenha").textContent = "Senha redefinida com sucesso!";
      document.getElementById("avisoSenha").style.color = "green";
      document.getElementById("nomeEsqueci").value = "";
      document.getElementById("novaSenha").value = "";
      document.getElementById("redefinirSenhaDiv").style.display = "none";
      document.getElementById("esqueciminhaSenha").style.display = "none";
      trocarsecao('login')
    }
}

