
exports.up = function(knex) {
    return knex.schema.createTable("feed", table => {
        table.string("id", 255).primary().notNullable();
        table.string("type", 255).notNullable().defaultTo("gtfs"); //re-migrate this if i don't want to do this
        table.string("title", 255).notNullable();
        table.integer("location").unsigned().notNullable();
        table.string("latest", 255);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("feed");
};
