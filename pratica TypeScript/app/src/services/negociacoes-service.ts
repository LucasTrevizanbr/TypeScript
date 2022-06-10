import { Negociacao } from './../models/negociacao.js';
import { NegociacaoDoDia } from './../interface/negociacao-do-dia.js';
export class NegociacaoService {

    public obterNegociacoesDoDia(): Promise<Negociacao[]>{

        return fetch('http://localhost:8080/dados').then(res => res.json())
        .then((dados: NegociacaoDoDia[]) => {
            return dados.map(dado => {
                return new Negociacao(new Date(), dado.vezes, dado.montante)
            })
        })
    }

}