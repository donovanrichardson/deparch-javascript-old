
exports.up = function(knex) {
  return knex.schema.createTable("agency", table =>{
      table.increments("key").primary();
      table.string("agency_id", 255);
      table.string("agency_name", 255).notNullable();
      table.text("agency_url").notNullable();
      table.string("agency_timezone",128).notNullable();
      table.string("feed_version", 255).notNullable();

      table.foreign("feed_version").references("id").inTable("feed_version").onDelete("CASCADE").onUpdate("CASCADE");
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable("agency");
};
