
exports.up = function(knex) {
    return knex.schema.createTable("service", table => {
        table.string("service_id", 128);

        table.integer("monday").defaultTo(0).notNullable();
        table.integer("tuesday").defaultTo(0).notNullable();
        table.integer("wednesday").defaultTo(0).notNullable();
        table.integer("thursday").defaultTo(0).notNullable();
        table.integer("friday").defaultTo(0).notNullable();
        table.integer("saturday").defaultTo(0).notNullable();
        table.integer("sunday").defaultTo(0).notNullable();

        table.integer("start_date");
        table.integer("end_date");
        table.string("feed_version", 255);
  
        table.primary(["service_id", "feed_version"]);
        table.foreign("feed_version").references("id").inTable("feed_version").onDelete("CASCADE").onUpdate("CASCADE");
        })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable("service");
  };
  