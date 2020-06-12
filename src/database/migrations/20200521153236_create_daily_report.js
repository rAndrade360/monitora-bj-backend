
exports.up = function (knex) {
    return knex.schema.createTable('daily_reports', function (table) {
        table.increments('id').primary();
        table.integer('patient_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('patients')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
	table.boolean('fever').notNullable().defaultTo(false);
        table.boolean('cough').notNullable().defaultTo(false);
        table.boolean('difficulty_breathing').notNullable().defaultTo(false);
        table.boolean('sputum_production').notNullable().defaultTo(false);
        table.boolean('nasal_congestion').notNullable().defaultTo(false);
        table.boolean('difficulty_swallowing').notNullable().defaultTo(false);
        table.boolean('sore_throat').notNullable().defaultTo(false);
        table.boolean('coryza').notNullable().defaultTo(false);
        table.boolean('signs_of_cyanosis').notNullable().defaultTo(false);
        table.boolean('drawing').notNullable().defaultTo(false);
        table.boolean('intercostal').notNullable().defaultTo(false);
        table.boolean('fatigue').notNullable().defaultTo(false);
        table.boolean('myalgia_or_arthralgia').notNullable().defaultTo(false);
        table.boolean('headache').notNullable().defaultTo(false);
        table.boolean('chill').notNullable().defaultTo(false);
        table.boolean('red_spots_on_the_body').notNullable().defaultTo(false);
        table.boolean('enlarged_lymph_nodes').notNullable().defaultTo(false);
        table.boolean('diarrhea').notNullable().defaultTo(false);
        table.boolean('nausea').notNullable().defaultTo(false);
        table.boolean('vomiting').notNullable().defaultTo(false);
        table.boolean('dehydration').notNullable().defaultTo(false);
        table.boolean('inappetence').notNullable().defaultTo(false);
        table.boolean('loss_of_taste').notNullable().defaultTo(false);
        table.boolean('loss_of_smell').notNullable().defaultTo(false);
	    table.boolean('readed').defaultTo(false);
        table.string('others');
        table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
        table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('daily_reports');
};
