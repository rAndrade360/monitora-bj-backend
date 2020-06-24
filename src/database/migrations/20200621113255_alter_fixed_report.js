exports.up = function (knex) {
  return knex.schema.table('fixed_reports', function (table) {
    table.string('blood_glucose');
    table.string('blood_pressure');
    table.string('temperature');
    table.string('heart_rate');
    table.string('oxygen_saturation');
    table.string('household_contacts');
    table.string('professional_name');
    table.text('additional_notes');
  });
};

exports.down = function (knex) {
  return knex.schema.table('fixed_reports', function (table) {
    table.dropColumn('blood_glucose');
    table.dropColumn('blood_pressure');
    table.dropColumn('temperature');
    table.dropColumn('heart_rate');
    table.dropColumn('oxygen_saturation');
    table.dropColumn('household_contacts');
    table.dropColumn('professional_name');
    table.dropColumn('additional_notes');
  });
};
