
exports.up = function(knex) {
  return knex.schema.createTable("service_exception", table => {
      table.string("service_id");
      table.integer("date");
      table.integer("exception_type").notNullable();
      table.string("feed_version", 255);

      table.primary("service_id", "date", "feed_version");
      table.foreign("feed_version").references("id").inTable("feed_version").onDelete("CASCADE").onUpdate("CASCADE");
      table.foreign(["service_id", "feed_version"]).references(["service_id", "feed_version"]).inTable("service").onDelete("CASCADE").onUpdate("CASCADE");
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable("service_exception");
};
