# nome = 'Victor'
# idade = 2
# print(f'Meu nome é {nome} tenho {idade} anos')


# Primeira funcao
# def saudacao():
#     nome = input('Qual o seu nome')
#     print(f'Hmm seu nome é {nome}' + ' .Oi')


# saudacao()


# Anotações
# Linguagem de alto nível x baixo nível:
#     são as linguagens mais próximas da linguagem natural, enquanto a de baixo nível é mais próxima a da máquina
#     - Vantagens:
#         Fácil compreensão
#     - Desvantagens
#         A linguagem da baixo nível tem melhor aproveitamento e desempenho da máquina



# def Saudacao2():
#     nome = input('Primeiro nome\n')
#     sobrenome = input('Sobrenome\n')
#     print(f"Seu nome é " + nome + " " + sobrenome)

# Saudacao2()

# Funções com parâmetro:

# def saudacao_com_parametros (nome_da_pessoa):
#     print(f'Olá {nome_da_pessoa}')
# saudacao_com_parametros(nome)


# Condicionais
# def verifica_idade(idade):
#     if (idade >= 18):
#         print("Pode dirigir")
#     else:
#         print("ta doidão?")


# verifica_idade(idade)


# def verifica_idade_sem_parametros():
#     idade = input("qual sua idade\n")
#     idade = float(idade)
#     if (idade >= 18):
#         print("Pode dirigir")
#     else:
#         print(f"ta doidão? {idade} anos?!")

# verifica_idade_sem_parametros()




#     Correct this code:  
a = 0
b = 1 
while a < 10:
    print (a)
    a, b =  b, a + b  # a = b, b = a + b
    