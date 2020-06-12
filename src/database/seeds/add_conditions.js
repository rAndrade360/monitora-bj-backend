
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('conditions').del()
    .then(function () {
      // Inserts seed entries
      return knex('conditions').insert([
        {id: 1, title: 'Doenças respiratórias crônicas descompensadas'},
        {id: 2, title: 'Doenças cardíacas crônicas'},
        {id: 3, title: 'Diabetes'},
        {id: 4, title: 'Doenças renais crônicas em estado avançado (graus 3, 4 e 5)'},
        {id: 5, title: 'Imunosupressão'},
        {id: 6, title: 'Gestante de alto risco'},
        {id: 7, title: 'Portador de doenças cromossômicas ou estado de fragilidade imunológica'}
      ]);
    });
};
