import * as readline from 'readline';
import { Item } from './item';
import * as fs from 'fs';

export class Inventario {
  private itens: Item[] = [];
  private arquivoCSV: string = 'inventario.csv';

  constructor() {
    // Carregar itens do arquivo CSV se existir
    this.carregarItensDoCSV();
  }

  adicionarItem(): void {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question('Nome do item: ', (nome) => {
      rl.question('Peso (kg): ', (peso) => {
        rl.question('Valor: ', (valor) => {
          rl.question('Quantidade: ', (quantidade) => {
            const item = new Item(nome, parseFloat(peso), parseFloat(valor), parseInt(quantidade, 10));
            // Verificar se o item já existe no inventário
            const itemExistente = this.itens.find((i) => i.nome === item.nome);
            if (itemExistente) {
              console.log('Item já existe no inventário.');
              rl.close();
              return;
            }

            // Adicionar o item ao inventário
            this.itens.push(item);
            console.log('Item adicionado com sucesso.');

            // Salvar os itens no arquivo CSV
            this.salvarItensNoCSV();
            rl.close();
          });
        });
      });
    });
  }

  removerItem(nome: string): void {
    const indice = this.itens.findIndex((i) => i.nome === nome);
    if (indice === -1) {
      console.log('Item não encontrado.');
      return;
    }

    // Remover o item do inventário
    this.itens.splice(indice, 1);
    console.log('Item removido com sucesso.');

    // Salvar os itens atualizados no arquivo CSV
    this.salvarItensNoCSV();
  }

  listarItens(): void {
    // Listar todos os itens
    this.itens.forEach((item) => {
      console.log(`Nome: ${item.nome}, Peso: ${item.peso} kg, Valor: R$ ${item.valor}, Quantidade: ${item.quantidade}`);
    });
  }

  calcularValorTotal(): void {
    // Calcular o valor total
    const valorTotal = this.itens.reduce((acc, item) => acc + item.valor * item.quantidade, 0);
    console.log(`Valor Total do Inventario: R$ ${valorTotal.toFixed(2)}`);
  }

  calcularMediaValor() {
    const totalItens = this.itens.length;
    if (totalItens === 0) {
      console.log('Não há itens no inventário para calcular a média de valor.');
      return;
    }

    const somaValores = this.itens.reduce((acc, item) => acc + item.valor * item.quantidade, 0);
    const mediaValor = somaValores / totalItens;
    console.log(`Média de Valor dos Itens: R$ ${mediaValor.toFixed(2)}`);
  }

  calcularMediaPeso() {
    const totalItens = this.itens.length;
    if (totalItens === 0) {
      console.log('Não há itens no inventário para calcular a média de peso.');
      return;
    }

    const somaPesos = this.itens.reduce((acc, item) => acc + item.peso * item.quantidade, 0);
    const mediaPeso = somaPesos / totalItens;
    console.log(`Média de Peso dos Itens: ${mediaPeso.toFixed(2)} kg`);
  }

  verQuantidadeTotalItens() {
    const totalItens = this.itens.reduce((acc, item) => acc + item.quantidade, 0);
    console.log(`Quantidade Total de Itens no Inventario: ${totalItens}`);
  }

  verQuantidadeTotalProdutos() {
    const itensUnicos = new Set(this.itens.map((item) => item.nome));
    const totalProdutos = itensUnicos.size;
    console.log(`Quantidade Total de Produtos no Inventario: ${totalProdutos}`);
  }



  // Implementar os outros métodos conforme necessário

  private carregarItensDoCSV(): void {
    try {
      if (fs.existsSync(this.arquivoCSV)) {
        const data = fs.readFileSync(this.arquivoCSV, 'utf-8');
        const linhas = data.split('\n');
        linhas.forEach((linha) => {
          const valores = linha.split(',');
          if (valores.length === 4) {
            const [nome, peso, valor, quantidade] = valores;
            this.itens.push(new Item(nome, parseFloat(peso), parseFloat(valor), parseInt(quantidade, 10)));
          }
        });
      }
    } catch (error) {
      console.error('Erro ao carregar itens do arquivo CSV:', error);
    }
  }

  private salvarItensNoCSV(): void {
    const linhas: string[] = this.itens.map((item) => `${item.nome},${item.peso},${item.valor},${item.quantidade}`);
    const dadosCSV = linhas.join('\n');
    fs.writeFileSync(this.arquivoCSV, dadosCSV);
  }
}
