import { domInjector } from '../decorators/dom-info-injector.js';
import { inspect } from '../decorators/inspect.js';
import { logarTempoDeExecucao } from '../decorators/logarTempoDeExecucao.js';
import { DiasDaSemana } from '../enums/dias-da-semana.js';
import { Negociacao } from '../models/negociacao.js';
import { Negociacoes } from '../models/negociacoes.js';
import { NegociacaoService } from '../services/negociacoes-service.js';
import { imprimir } from '../utils/imprimir.js';
import { MensagemView } from '../views/mensagem-view.js';
import { NegociacoesView } from '../views/negociacoes-view.js';

export class NegociacaoController {

    @domInjector('#data')
    private inputData: HTMLInputElement;

    @domInjector('#quantidade')
    private inputQuantidade: HTMLInputElement;

    @domInjector('#valor')
    private inputValor: HTMLInputElement;
    
    private negociacoes = new Negociacoes();
    private negociacoesView = new NegociacoesView('#negociacoesView', true);
    private mensagemView = new MensagemView('#mensagemView');

    private servico = new NegociacaoService();

    constructor() {
        this.negociacoesView.update(this.negociacoes);
    }


    @inspect()
    @logarTempoDeExecucao()
    public adiciona(): void {

        const negociacao = Negociacao.criaDe(
            this.inputData.value, 
            this.inputQuantidade.value,
            this.inputValor.value
        );
     
        if (!this.ehDiaUtil(negociacao.data)) {
            this.mensagemView
                .update('Apenas negociações em dias úteis são aceitas');
            return ;
        }

        this.negociacoes.adiciona(negociacao);
        imprimir(negociacao, this.negociacoes)
        this.limparFormulario();
        this.limparFormulario();
        this.atualizaView();
    }

    public importaDados() : void {
       this.servico
       .obterNegociacoesDoDia()
       .then(negociacosDeHoje => {
           return negociacosDeHoje.filter(negociacosDeHoje => {
               return !this.negociacoes
                .lista()
                .some(negociacao => negociacao.ehIgual(negociacosDeHoje))
           })
       })
       .then(
            negociacosHoje => {
            for(let negociacao of negociacosHoje) {
                this.negociacoes.adiciona(negociacao)
            }
            this.negociacoesView.update(this.negociacoes);
        })
    }

    private ehDiaUtil(data: Date) {
        return data.getDay() > DiasDaSemana.DOMINGO 
            && data.getDay() < DiasDaSemana.SABADO;
    }

    private limparFormulario(): void {
        this.inputData.value = '';
        this.inputQuantidade.value = '';
        this.inputValor.value = '';
        this.inputData.focus();
    }

    private atualizaView(): void {
        this.negociacoesView.update(this.negociacoes);
        this.mensagemView.update('Negociação adicionada com sucesso');
    }
}
