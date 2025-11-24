const emailInput = document.getElementById("emailRecuperar");
const msg = document.getElementById("msg");
const btn = document.getElementById("btnRecuperar");

btn.addEventListener("click", () => {
    const email = emailInput.value.trim();

    // Pegar dados salvos no cadastro
    const emailSalvo = localStorage.getItem("email");
    const senhaSalva = localStorage.getItem("senha");

    if (email !== emailSalvo) {
        msg.innerText = "Email não encontrado no sistema!";
        msg.style.color = "red";
        return;
    }

    const novaSenha = prompt("Digite sua nova senha:");

    if (!novaSenha) {
        msg.innerText = "Senha não alterada.";
        msg.style.color = "red";
        return;
    }

    // Atualizar LocalStorage
    localStorage.setItem("senha", novaSenha);

    msg.innerText = "Senha alterada com sucesso!";
    msg.style.color = "green";
});
