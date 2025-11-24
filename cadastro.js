const senha = document.getElementById("senha");
const confirmaSenha = document.getElementById("confirmaSenha");
const mostrarSenha = document.getElementById("mostrarSenha");
const mostrarConfirmaSenha = document.getElementById("mostrarConfirmaSenha");

// Mostrar/Ocultar senha
mostrarSenha.addEventListener("click", () => {
    senha.type = senha.type === "password" ? "text" : "password";
    mostrarSenha.classList.toggle("fa-eye-slash");
});

// Mostrar/Ocultar confirmar senha
mostrarConfirmaSenha.addEventListener("click", () => {
    confirmaSenha.type = confirmaSenha.type === "password" ? "text" : "password";
    mostrarConfirmaSenha.classList.toggle("fa-eye-slash");
});

// --- VALIDAR E CADASTRAR ---
document.getElementById("formCadastro").addEventListener("submit", function (e) {
    e.preventDefault();

    let campos = document.querySelectorAll("input:not([readonly])");
    let vazio = false;

    // valida campos vazios
    campos.forEach(campo => {
        if (campo.value.trim() === "") {
            vazio = true;
            campo.style.border = "2px solid red";
        } else {
            campo.style.border = "";
        }
    });

    if (vazio) {
        alert("Preencha todos os campos!");
        return;
    }

    // ViaCEP
document.getElementById("cep").addEventListener("blur", function () {
    let vl = this.value;

    fetch(`https://viacep.com.br/ws/${vl}/json/`)
        .then(response => response.json())
        .then(dados => {
            document.getElementById("endereco").style.display = "block";
            document.getElementById("logradouro").value = dados.logradouro;
            document.getElementById("bairro").value = dados.bairro;
            document.getElementById("cidade").value = dados.localidade;
            document.getElementById("estado").value = dados.uf;
        })
        .catch(error => {
            console.error("Erro ao buscar CEP:", error);
        });
});

    // valida senha
    if (senha.value !== confirmaSenha.value) {
        alert("As senhas não coincidem!");
        senha.style.border = "2px solid red";
        confirmaSenha.style.border = "2px solid red";
        return;
    }

    // PEGAR DADOS
    const nome = document.querySelector("input[name='nome']").value.trim();
    const email = document.querySelector("input[name='email']").value.trim();
    const telefone = document.querySelector("input[name='telefone']").value.trim();
    const senhaValor = senha.value.trim();

    // SALVAR NO LOCALSTORAGE
    localStorage.setItem("nome", nome);
    localStorage.setItem("email", email);
    localStorage.setItem("telefone", telefone);
    localStorage.setItem("senha", senhaValor);
    localStorage.setItem("cadastrado", "sim");

    alert("Cadastro realizado com sucesso!");

    // REDIRECIONAR
    window.location.href = "clima.html";
});


// ViaCEP
document.getElementById("cep").addEventListener("blur", function () {
    let vl = this.value;

    fetch(`https://viacep.com.br/ws/${vl}/json/`)
        .then(response => response.json())
        .then(dados => {
            document.getElementById("endereco").style.display = "block";
            document.getElementById("logradouro").value = dados.logradouro;
            document.getElementById("bairro").value = dados.bairro;
            document.getElementById("cidade").value = dados.localidade;
            document.getElementById("estado").value = dados.uf;

             // ➤ SALVA A CIDADE NO LOCALSTORAGE
    localStorage.setItem("cidadeCadastro", dados.localidade);
        })
        .catch(error => {
            console.error("Erro ao buscar CEP:", error);
        });
});
          
document.getElementById("formCadastro").addEventListener("submit", function (event) {
    let campos = document.querySelectorAll("input");
    let vazio = false;

    campos.forEach(campo => {
        if (campo.value.trim() === "") {
            vazio = true;
            campo.style.border = "2px solid red";
        } else {
            campo.style.border = "";
        }
    });

    if (vazio) {
        event.preventDefault();
        alert("Preencha todos os campos!");
    }
});


// ======= CONEXÃO COM LOGIN =======
localStorage.setItem("nomeUsuario", nome);


