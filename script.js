var cronometro = 0;
var centesimos = 0;
var segundos = 0;
var minutos = 0;

var view = {
    volta: 0,

    alterarValor: function(id, valor) {
        var campo = document.getElementById(id);
        if (valor < 10) {
            campo.innerHTML = "0" + valor;   
        } else {
            campo.innerHTML = valor;               
        }
    },

    inserirVolta: function(zerar) {
        var tabela = document.getElementById("voltas");
        this.volta++;
        if (zerar) {
            tabela.innerHTML = ""
        } else {
            tabela.innerHTML += `<tr>
                                    <td class="volta">${this.volta}</td>
                                    <td>${model.calculaTempoVolta()}</td>
                                    <td>${view.adicionarZero(minutos)}:${view.adicionarZero(segundos)}.${view.adicionarZero(centesimos)}</td>
                                </tr>`
        };
    },

    estadoBotao: function(estado, botao) {
        var botaoAlternar = document.getElementById(botao);
        if (estado === "oculto") {
            botaoAlternar.classList.add("oculto");       
        } else if (estado == "aparente") {
            botaoAlternar.classList.remove("oculto");       
        }
    },

    adicionarZero: function(numero) {
        if (numero < 10) {
            return "0" + numero;
        } else {
            return numero;
        }
    }
};

var model = {
    centesimosVolta: 0,
    segundosVolta: 0,
    minutosVolta: 0,
    
    calculaTempoVolta: function() {
        var tempoInicial = new Date(1970, 1, 1, 0, this.minutosVolta, this.segundosVolta, (this.centesimosVolta*10));
        var tempoAtual = new Date(1970, 1, 1, 0, minutos, segundos, (centesimos*10)); 
        var tempoVolta = (tempoAtual - tempoInicial) / 1000;

        this.minutosVolta = minutos;
        this.segundosVolta = segundos;
        this.centesimosVolta = centesimos;

        var centesimosExibicao = (tempoVolta - Math.trunc(tempoVolta)) * 100;
        var segundosExibicao = Math.trunc(tempoVolta);
        var minutosExibicao = 0;
        
        while (segundosExibicao > 60) {
            segundosExibicao -= 60;
            minutosExibicao++;
        }
        return view.adicionarZero(minutosExibicao) + ":" + view.adicionarZero(segundosExibicao) + "." + view.adicionarZero(centesimosExibicao.toFixed(0));
    },

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
        view.alterarValor("minutos", minutos);
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
        clearInterval(cronometro);
        cronometro = setInterval(model.passagemCentesimos, 10);
        view.estadoBotao("oculto", "iniciar");
        view.estadoBotao("oculto", "parar");        
        view.estadoBotao("aparente", "pausar");
        view.estadoBotao("aparente", "volta");
    },
    
    pausar: function() {
        clearInterval(cronometro);
        view.estadoBotao("aparente", "iniciar");
        view.estadoBotao("aparente", "parar");
        view.estadoBotao("oculto", "pausar");
        view.estadoBotao("oculto", "volta");
    },

    parar: function() {
        controller.pausar();
        view.estadoBotao("aparente", "iniciar");
        view.estadoBotao("oculto", "parar");
        view.estadoBotao("oculto", "pausar");
        view.estadoBotao("oculto", "volta");            
        view.alterarValor("centesimos", 0)
        view.alterarValor("segundos", 0)
        view.alterarValor("minutos", 0)
        view.inserirVolta(true);
        centesimos = 0;
        segundos = 0;
        minutos = 0;
        horas = 0;
        view.volta = 0;
        model.centesimosVolta = 0;
        model.segundosVolta = 0;
        model.minutosVolta = 0;
    },

    volta: function() {
        view.inserirVolta();
    }

};

window.onload = function() {
var botoes = document.getElementsByClassName("botao");
    for (let i = 0; i < botoes.length; i++) {
        botoes[i].onclick = controller.controles;
    }
};