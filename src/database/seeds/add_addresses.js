exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('districts')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('districts').insert([
        { id: 1, name: 'Centro', zone: 'urbana' },
        { id: 2, name: 'Alto dos Praxedes', zone: 'urbana' },
        { id: 3, name: 'Vila São Bernardo', zone: 'urbana' },
        { id: 4, name: 'Joana Darc', zone: 'urbana' },
        { id: 5, name: 'Multirão', zone: 'urbana' },
        { id: 6, name: 'Vila Meireles', zone: 'urbana' },
        { id: 7, name: 'Vila Munins', zone: 'urbana' },
        { id: 8, name: 'Cohab', zone: 'urbana' },
        { id: 9, name: 'Vila União', zone: 'urbana' },
        { id: 10, name: 'Vila Esperança', zone: 'urbana' },
        { id: 11, name: 'Vila Santa Clara', zone: 'urbana' },
        { id: 12, name: 'Vila Pedrosa', zone: 'urbana' },
        { id: 13, name: 'Vila Marcony', zone: 'urbana' },
        { id: 14, name: 'Bairro do Firmino', zone: 'urbana' },
        { id: 15, name: 'Aldeia', zone: 'rural' },
        { id: 16, name: 'Barraca Lavada', zone: 'rural' },
        { id: 17, name: 'Oscar', zone: 'rural' },
        { id: 18, name: 'Varig', zone: 'rural' },
        { id: 19, name: 'Santa Luz', zone: 'rural' },
        { id: 20, name: 'KM12', zone: 'rural' },
        { id: 21, name: 'Vila Abreu', zone: 'rural' },
        { id: 22, name: 'Novo Carú', zone: 'rural' },
        { id: 23, name: 'Igarapé dos índios', zone: 'rural' },
        { id: 24, name: 'Boa Vista', zone: 'rural' },
        { id: 25, name: 'Gurvia', zone: 'rural' },
        { id: 26, name: 'Povoado Traíra', zone: 'rural' },
        { id: 27, name: 'Vila Novo Jardim', zone: 'rural' },
        { id: 28, name: 'Zé Boeiro', zone: 'rural' },
        { id: 29, name: 'Povoado Rosário', zone: 'rural' },
        { id: 30, name: 'Barra do Galego', zone: 'rural' },
        { id: 31, name: 'CT. Nascimento', zone: 'rural' },
        { id: 32, name: 'Tirirical', zone: 'rural' },
        { id: 33, name: 'Cassimiro', zone: 'rural' },
        { id: 34, name: 'KM18', zone: 'rural' },
        { id: 35, name: 'Bairro Nobre', zone: 'rural' },
        { id: 36, name: 'Vila Bandeirante', zone: 'rural' },
        { id: 37, name: 'Vila Barrote', zone: 'rural' },
      ]);
    });
};
