import addressMapper from '../mapper/AddressMapper.js';
 
class AddressService {
  create(createAddressRequest, userId) {
    const address = addressMapper.toAddress(createAddressRequest, userId);

 
    return addressMapper.toResponse(address);
  }
 
  findAll(userId, keyword) {
    // falta repositório: buscar endereços do usuário (com filtro por keyword)
  }
 
  update(id, updateAddressRequest, userId) {
    // falta repositório: buscar endereço por id e validar se pertence ao userId
 
    const address = addressMapper.toAddress(updateAddressRequest, userId);
    address.id = id;
 
    // falta repositório: salvar as alterações no banco
    // falta: registrar log da alteração (dados modificados + id do usuário)
 
    return addressMapper.toResponse(address);
  }
 
  delete(id, userId) {
    // falta repositório: buscar endereço por id e validar se pertence ao userId
    // falta repositório: remover endereço do banco
    // falta: registrar log da exclusão (dados removidos + id do usuário)
  }
 
  share(id, userId, expiresIn) {
    // falta repositório: buscar endereço e validar se pertence ao userId
    // falta: gerar token JWT com o id do endereço e validade (expiresIn)
    // falta: montar e retornar a URL com o token gerado
  }
 
  getShared(token) {
    // falta: validar/decodificar o token JWT (jwt.verify)
    // falta: se expirado ou inválido, lançar erro
    // falta repositório: buscar endereço pelo id contido no token
  }
}
 
export default new AddressService();