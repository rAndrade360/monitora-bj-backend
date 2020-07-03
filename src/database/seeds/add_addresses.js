exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('districts')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('districts').insert([
        { name: 'Centro', zone: 'urbana' },
        { name: 'Alto dos Praxedes', zone: 'urbana' },
        { name: 'Vila São Bernardo', zone: 'urbana' },
        {  name: 'Joana Darc', zone: 'urbana' },
        { name: 'Multirão', zone: 'urbana' },
        {  name: 'Vila Meireles', zone: 'urbana' },
        { name: 'Vila Munins', zone: 'urbana' },
        { name: 'Cohab', zone: 'urbana' },
        { name: 'Vila União', zone: 'urbana' },
        { name: 'Vila Esperança', zone: 'urbana' },
        { name: 'Vila Santa Clara', zone: 'urbana' },
        {  name: 'Vila Pedrosa', zone: 'urbana' },
        {  name: 'Vila Marcony', zone: 'urbana' },
        {  name: 'Bairro do Firmino', zone: 'urbana' },
        {  name: 'Aldeia', zone: 'rural' },
        {  name: 'Barraca Lavada', zone: 'rural' },
        {  name: 'Oscar', zone: 'rural' },
        { name: 'Varig', zone: 'rural' },
        {  name: 'Santa Luz', zone: 'rural' },
        {  name: 'KM12', zone: 'rural' },
        {  name: 'Vila Abreu', zone: 'rural' },
        { name: 'Novo Carú', zone: 'rural' },
        {  name: 'Igarapé dos índios', zone: 'rural' },
        { name: 'Boa Vista', zone: 'rural' },
        {  name: 'Gurvia', zone: 'rural' },
        {  name: 'Povoado Traíra', zone: 'rural' },
        {  name: 'Vila Novo Jardim', zone: 'rural' },
        {  name: 'Zé Boeiro', zone: 'rural' },
        {  name: 'Povoado Rosário', zone: 'rural' },
        {  name: 'Barra do Galego', zone: 'rural' },
        { name: 'CT. Nascimento', zone: 'rural' },
        { name: 'Tirirical', zone: 'rural' },
        { name: 'Cassimiro', zone: 'rural' },
        {  name: 'KM18', zone: 'rural' },
        {  name: 'Bairro Nobre', zone: 'rural' },
        {  name: 'Vila Bandeirante', zone: 'rural' },
        {  name: 'Vila Barrote', zone: 'rural' },
      ]);
    });
};
