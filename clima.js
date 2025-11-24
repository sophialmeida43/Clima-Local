"use strict";

// ========= BUSCAR CLIMA =========
const API_KEY = "5227e13ac99dc0d2d9707d161e0b1bcf";
async function pesquisarClima(cidade) {
    try {
        // Clima atual
        const urlAtual = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${API_KEY}&units=metric&lang=pt_br`;

        // Previsão (para max/min)
        const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${cidade}&appid=${API_KEY}&units=metric&lang=pt_br`;

        const [resAtual, resPrev] = await Promise.all([
            fetch(urlAtual),
            fetch(urlForecast)
        ]);

        const dadosAtual = await resAtual.json();
        const dadosPrev = await resPrev.json();

        if (dadosAtual.cod !== 200) return null;

        // Retorno
        return {
            location: {
                name: dadosAtual.name,
                region: dadosAtual.sys.country
            },
            current: {
                temp_c: dadosAtual.main.temp,
                humidity: dadosAtual.main.humidity,
                wind_kph: dadosAtual.wind.speed * 3.6, // m/s → km/h
                condition: {
                    text: dadosAtual.weather[0].description,
                    icon: `https://openweathermap.org/img/wn/${dadosAtual.weather[0].icon}@2x.png`
                }
            },
            forecast: {
                forecastday: [
                    {
                        day: {
                            maxtemp_c: dadosPrev.list[0].main.temp_max,
                            mintemp_c: dadosPrev.list[0].main.temp_min
                        }
                    }
                ]
            },
            timezone: dadosAtual.timezone // <-- adicionamos isso
        };

    } catch (e) {
        console.error("Erro:", e);
        return null;
    }
}

// ========= HORA DE BRASÍLIA =========
function horaBrasilia() {
    const agora = new Date();
    return agora.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "America/Sao_Paulo"
    });
}

// ========= DIA DA SEMANA =========
function diaSemana() {
    const dias = [
        "Domingo", "Segunda-feira", "Terça-feira",
        "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"
    ];
    return dias[new Date().getDay()];
}

// ========= MUDAR FUNDO =========
function mudarFundo(cond) {
    const body = document.body;
    const txt = cond.toLowerCase();

    if (txt.includes("sol") || txt.includes("claro")) {
        body.style.background = "#F7D358";
    } 
    else if (txt.includes("chuva")) {
        body.style.background = "#4375add3";
    }
    else if (txt.includes("tempestate") || txt.includes("storm")) {
        body.style.background = "#3c7296ff";
    }
    else if (txt.includes("nublado") || txt.includes("cloud")) {
        body.style.background = "#366b6bfd";
    } 
    else {
        body.style.background = "linear-gradient(#6b6b6bff, #80a2f8)";
    }
}

// ========= PROCESSAR FORMULÁRIO =========
async function preencherFormulario(event) {
    event.preventDefault();

    const cidade = document.getElementById("city_name").value.trim();
    const alertDiv = document.getElementById("alert");

    if (!cidade) return;

    alertDiv.textContent = "Buscando...";
    alertDiv.style.color = "black";

    const info = await pesquisarClima(cidade);

    if (!info) {
        alertDiv.textContent = "Cidade não encontrada!";
        alertDiv.style.color = "red";
        return;
    }

    alertDiv.textContent = "";

    // ===== TÍTULO =====
    const uf = info.location.region;
    document.getElementById("title").textContent =
        `${info.location.name}, ${uf}`;

    // ===== ÍCONE =====
    document.getElementById("temp_img").src = info.current.condition.icon;

    // ===== TEMP ATUAL =====
    document.getElementById("temp_value").innerHTML =
        `${Math.round(info.current.temp_c)} <sup>º</sup>`;

    // ===== DESCRIÇÃO =====
    document.getElementById("temp_description").textContent =
        info.current.condition.text;

    // Temp. máx
    document.getElementById("temp_max").innerHTML =
        `${Math.round(info.forecast.forecastday[0].day.maxtemp_c)} <sup>Cº</sup>`;

    // Temp. mín
    document.getElementById("temp_min").innerHTML =
        `${Math.round(info.forecast.forecastday[0].day.mintemp_c)} <sup>Cº</sup>`;

    // Umidade
    document.getElementById("humidity").textContent =
        `${info.current.humidity}%`;

    // Vento
    document.getElementById("wind").textContent =
        `${Math.round(info.current.wind_kph)} km/h`;

    // ===== FUNDO =====
    mudarFundo(info.current.condition.text);

// ======== FUSO HORÁRIO ========
const timezoneSeg = info.timezone; // segundos vindos da API
const timezoneHoras = timezoneSeg / 3600; // pode dar +5.5, +9.75 etc

// UTC do Brasil (Brasília)
const brasilUTC = -3;

// Diferença real em horas
const diferencaBrasil = timezoneHoras - brasilUTC;

// ------- Função para formatar no formato B (ex: 8h30min) -------
function formatarFusoB(valor) {

    let abs = Math.abs(valor);

    let horas = Math.floor(abs);
    let minutos = Math.round((abs - horas) * 60);

    // Caso não tenha minutos (ex: 3.0)
    if (minutos === 0) {
        return `${horas}h`;
    }

    return `${horas}h${minutos}min`;
}

let textoFuso = "";

// Exibir frase correta
if (diferencaBrasil > 0) {
    textoFuso = `${formatarFusoB(diferencaBrasil)} a mais que o Brasil`;
} else if (diferencaBrasil < 0) {
    textoFuso = `${formatarFusoB(diferencaBrasil)} a menos que o Brasil`;
} else {
    textoFuso = "Mesmo horário do Brasil";
}

// Exibe no HTML
document.getElementById("fuso_horario").textContent =
    "Fuso Horário: " + textoFuso;

}


// ========= RELÓGIO =========
setInterval(() => {
    document.getElementById("hora_brasilia").textContent =
        "Horário: " + horaBrasilia();

    document.getElementById("dia_semana").textContent =
        "semana: " + diaSemana();
}, 1000);

// ========= EVENTO DO FORM =============
document.getElementById("search").addEventListener("submit", preencherFormulario);


// ========= MOSTRAR CLIMA DA CIDADE CADASTRADA =========
window.addEventListener("DOMContentLoaded", async () => {
    const cidadeSalva = localStorage.getItem("cidadeCadastro");

    if (cidadeSalva) {
        // Coloca a cidade cadastrada no input
        document.getElementById("city_name").value = cidadeSalva;

        // Busca automático
        const info = await pesquisarClima(cidadeSalva);

        if (info) {
            // Preenche exatamente igual ao formulário manual
            document.getElementById("title").textContent =
                `${info.location.name}, ${info.location.region}`;

            document.getElementById("temp_img").src = info.current.condition.icon;

            document.getElementById("temp_value").innerHTML =
                `${Math.round(info.current.temp_c)} <sup>º</sup>`;

            document.getElementById("temp_description").textContent =
                info.current.condition.text;

            document.getElementById("temp_max").innerHTML =
                `${Math.round(info.forecast.forecastday[0].day.maxtemp_c)} <sup>Cº</sup>`;

            document.getElementById("temp_min").innerHTML =
                `${Math.round(info.forecast.forecastday[0].day.mintemp_c)} <sup>Cº</sup>`;

            document.getElementById("humidity").textContent =
                `${info.current.humidity}%`;

            document.getElementById("wind").textContent =
                `${Math.round(info.current.wind_kph)} km/h`;

            mudarFundo(info.current.condition.text);
        }
    }
});
