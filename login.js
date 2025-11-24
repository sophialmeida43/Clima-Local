// --- Mostrar/Ocultar senha ---
const password = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", () => {

    const type = password.type === "password" ? "text" : "password";
    password.type = type;

    togglePassword.classList.toggle("bx-show");
    togglePassword.classList.toggle("bx-hide");
});

// --- LOGIN ---
const email = document.getElementById("user");
const senha = document.getElementById("password");
const btnLogin = document.getElementById("btnLogin");

btnLogin.addEventListener("click", (e) => {
    e.preventDefault();

    const emailValor = email.value.trim();
    const senhaValor = senha.value.trim();

    if (emailValor === "" || senhaValor === "") {
        alert("Preencha usuário e senha!");
        return;
    }

    // Buscar cadastro salvo
    const emailCadastrado = localStorage.getItem("email");
    const senhaCadastrada = localStorage.getItem("senha");

    if (!emailCadastrado || !senhaCadastrada) {
        alert("Você ainda não tem cadastro! Faça seu cadastro primeiro.");
        return;
    }

    if (emailValor === emailCadastrado && senhaValor === senhaCadastrada) {

        localStorage.setItem("logado", "sim");
        window.location.href = "clima.html";

    } else {
        alert("Email ou senha incorretos!");
    }
});


// ======= CONEXÃO COM CADASTRO =======

// Pegar nome salvo no cadastro
const nomeCadastrado = localStorage.getItem("nomeUsuario");

// Campo do usuário do login
const inputUser = document.getElementById("user");

// Verificar quando sai do campo
inputUser.addEventListener("blur", () => {
    const digitado = inputUser.value.trim();

    if (!nomeCadastrado) {
        console.log("Nenhum usuário salvo no cadastro.");
        return;
    }

    if (digitado === nomeCadastrado) {
        console.log("Usuário correto!");
        inputUser.style.borderColor = "green";
    } else {
        console.log("Usuário incorreto!");
        inputUser.style.borderColor = "red";
    }
});
