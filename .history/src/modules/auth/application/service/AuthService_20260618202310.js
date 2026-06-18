import authMapper from '../mapper/AuthMapper.js';
 
class AuthService {
  register(registerRequest) {
    const user = authMapper.toUser(registerRequest);
 
    // falta repositório: validar se já existe usuário com esse email
    // falta: gerar hash da senha (bcrypt) antes de salvar
    // falta repositório: salvar o usuário no banco
  }
 
  login(loginRequest) {
    // falta repositório: buscar usuário pelo email
    // falta: se não existir, lançar erro de credenciais inválidas
    // falta: comparar senha informada com o hash salvo (bcrypt.compare)
    // falta: gerar token JWT com o id do usuário
    // falta: retornar o token gerado
  }
}
 
export default new AuthService();
 