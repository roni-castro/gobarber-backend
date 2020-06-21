# Recuperação de senha

**RF**

- O usuário deve conseguir recuperar sua senha informando o email
- O usuário deve receber um email com instruções para recuperar sua senha
- O usuário deve poder resetar sua senha

**RNF**

- Deve-se utilizar um serviço de envio email para testar em ambiente de dev
- Deve-se utilizar o serviço Amazon SES para envio de email em produção
- O envio de emails deve acontecer em segundo plano (job)

**RN**

- O email de reset de senha deve expirar após 2h do seu envio
- O usuário digitar a nova senha e a senha de confirmação

# Atualização do perfil

**RF**

- O usuário deve poder editar seu avatar, nome, email e senha

**RNF**

**RN**

- O usuário não pode trocar seu email para um já utilizado no sistema
- Para atualizar a senha, o usuário deve digitar sua senha antiga
- Para atualizar a senha, o usuário deve digitar a nova senha assim como a senha de confirmação

# Painel do prestador

**RF**

- O usuário deve poder listar seus atendimentos em um dia específico do mês
- O prestador deve receber uma notificação sempore que houver um novo agendamento
- O prestador deve poder visualizar as notificações não lidas

**RNF**

- Os agendamentos do prestador no dia devem ser armazenados em cache
- As notificações do prestador devem ser armazenadas no MongoDB
- As notificações do prestador devem ser enviadas em tempo real utilizando Socket.io

**RN**

- A notificação deve ter um status de lida ou não-lidas para que o prestador possa controlar

# Agendamento de serviços

**RF**

- O usuário deve poder listar os prestadores de serviços
- O usuário deve poder listar os dias de um mês com pelo menos um horário disponível de um prestador
- O usuário deve poder listar os horários disponíveis de uma dia específico de um prestador
- O usuário deve poder realizar um novo agendamento com um prestador

**RNF**

- A listagem de prestadores deve ser armazenada em cache

**RN**

- Cada agendamento deve ter duração de 1h
- Os agendamentos devem estar disponíveis entre 8h às 18h (Primeiro às 8h e último às 17h)
- Não deve ser permitido agendar serviço em um horário já reservado
- Não deve ser permitido agendar serviço em um horário/data que já passou
- O usuário não poder agendar serviços consigo mesmo
