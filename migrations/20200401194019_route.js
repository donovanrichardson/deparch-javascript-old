exports.up = function(knex) {
    return knex.schema.createTable("route", table => {
        table.string("route_id", 128);
        table.string("agency_id", 255)
        table.string("route_short_name", 255); 
        table.string("route_long_name", 255);
        table.text("route_desc");
        table.integer("route_type").notNullable();
        table.text("route_url");
        table.string("route_color", 6).defaultTo("ffffff");
        table.string("route_text_color", 6).defaultTo("000000");
        table.integer("route_sort_order").unsigned();
        table.string("feed_version", 255);
  
        table.primary(["route_id", "feed_version"]);
        table.index("route_short_name");
        table.foreign("feed_version").references("id").inTable("feed_version").onDelete("CASCADE").onUpdate("CASCADE");
        })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable("route");
  };