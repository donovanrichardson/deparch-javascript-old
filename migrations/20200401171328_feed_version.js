
exports.up = function(knex) {
    return knex.schema.createTable("feed_version", table => {
        table.string("id", 255).primary().notNullable();
        table.string("feed").notNullable();
        table.bigInteger("timestamp").unsigned().notNullable();
        table.bigInteger("size").unsigned().notNullable();
        table.text("url").notNullable();
        table.integer("start");
        table.integer("finish");
        table.timestamp("inserted").notNullable().defaultTo(knex.fn.now()); //tz is true in postgres

        table.foreign("feed").references("id").inTable("feed").onDelete("CASCADE").onUpdate("CASCADE");
    })
};

exports.down = function(knex) {
  return knex.schema.dropTable("feed_version");
};
