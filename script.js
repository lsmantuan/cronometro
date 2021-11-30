var cronometro = 0;
var centesimos = 0;
var segundos = 0;
var minutos = 0;
var horas = 0;

var view = {
    volta: 0,
    segundosVolta: 0,

    alterarValor: function(id, valor) {
        var campo = document.getElementById(id);
        if (valor < 10) {
            campo.innerHTML = "0" + valor;   
        } else {
            campo.innerHTML = valor;               
        }
    },

    inserirVolta: function() {
        var tabela = document.getElementById("voltas");
        this.volta++;
       
        this.segundosVolta = segundos - this.segundosVolta;
        tabela.innerHTML += `<tr><td class="volta">${this.volta}</td><td>${horas.valueOf()}:${minutos.valueOf()}:${segundos.valueOf()}:${centesimos.valueOf()}</td><td>Teste</td></tr>`;
        console.log(this.segundosVolta);
    }
};

var model = {
    passagemCentesimos: function() {
        centesimos++;
        if (centesimos > 99) {
            centesimos = 0;
            model.passagemSegundos();
        };
        view.alterarValor("centesimos", centesimos);
    },

    passagemSegundos: function() {
        segundos++;
        if (segundos > 59) {
            segundos = 0;
            model.passagemMinutos();
        };
        view.alterarValor("segundos", segundos);
    },

    passagemMinutos: function() {
        minutos++;
        if (minutos > 59) {
            minutos = 0;
            model.passagemHoras();
        };
        view.alterarValor("minutos", minutos);
    },

    passagemHoras: function() {
        horas++;
        view.alterarValor("horas", horas);
    }
};

var controller = {
    controles: function(event) {
        var idBotao = event.target.id;
        if (idBotao === "iniciar") {
            controller.iniciar();
        } else if (idBotao === "pausar") {
            controller.pausar();
        } else if (idBotao === "parar") {
            controller.parar();
        } else if (idBotao === "volta") {
            controller.volta();
        };
    },

    iniciar: function() {
        controller.pausar();
        cronometro = setInterval(model.passagemCentesimos, 10);
    },

    pausar: function() {
        clearInterval(cronometro);
    },

    parar: function() {
        controller.pausar();     
        view.alterarValor("centesimos", 0)
        view.alterarValor("segundos", 0)
        view.alterarValor("minutos", 0)
        view.alterarValor("horas", 0)
        centesimos = 0;
        segundos = 0;
        minutos = 0;
        horas = 0;
    },

    volta: function() {
        view.inserirVolta();
    }

};

Number.prototype.valueOf = function() {
    var numeroFormatado = this.toString();
    if (numeroFormatado < 9) {
        return "0" + numeroFormatado;
    } else {
        return numeroFormatado;
    }
};

window.onload = function() {
var botoes = document.getElementsByClassName("botao");
    for (let i = 0; i < botoes.length; i++) {
        botoes[i].onclick = controller.controles;
    }
};