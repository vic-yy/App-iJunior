// main.ts
import * as readline from 'readline';
import { Inventario, Item } from './inventory';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const inventario = new Inventario();

function adicionarItem() {
  rl.question('Nome do item: ', (nome) => {
    rl.question('Peso (kg): ', (peso) => {
      rl.question('Valor: ', (valor) => {
        rl.question('Quantidade: ', (quantidade) => {
          const item = new Item(nome, parseFloat(peso), parseFloat(valor), parseInt(quantidade, 10));
          inventario.adicionarItem(item);
          rl.close();
        });
      });
    });
  });
}

function removerItem() {
  rl.question('Nome do item a ser removido: ', (nome) => {
    inventario.removerItem(nome);
    rl.close();
  });
}

function listarItens() {
  inventario.listarItens();
  rl.close();
}

function calcularValorTotal() {
    inventario.calcularValorTotal();
    rl.close();
  }
  
  function calcularPesoTotal() {
    inventario.calcularPesoTotal();
    rl.close();
  }
  
  function calcularMediaValor() {
    inventario.calcularMediaValor();
    rl.close();
  }
  
  function calcularMediaPeso() {
    inventario.calcularMediaPeso();
    rl.close();
  }
  
  function verQuantidadeTotalItens() {
    inventario.verQuantidadeTotalItens();
    rl.close();
  }
  
  function verQuantidadeTotalProdutos() {
    inventario.verQuantidadeTotalProdutos();
    rl.close();
  }

function main() {
    rl.question('Escolha uma opção (1-9):\n1. Adicionar Item\n2. Remover Item\n3. Listar Itens\n4. Calcular Valor Total\n5. Calcular Peso Total\n6. Calcular Média de Valor\n7. Calcular Média de Peso\n8. Ver Quantidade Total de Itens\n9. Ver Quantidade Total de Produtos\nOpção: ', (option) => {
      switch (option) {
        case '1':
          adicionarItem();
          break;
        case '2':
          removerItem();
          break;
        case '3':
          listarItens();
          break;
        case '4':
          calcularValorTotal();
          break;
        case '5':
          calcularPesoTotal();
          break;
        case '6':
          calcularMediaValor();
          break;
        case '7':
          calcularMediaPeso();
          break;
        case '8':
          verQuantidadeTotalItens();
          break;
        case '9':
          verQuantidadeTotalProdutos();
          break;
        default:
          console.log('Opção inválida.');
          main();
      }
    });
  }
  

main();
