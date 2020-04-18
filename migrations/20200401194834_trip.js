
exports.up = function(knex) {
    return knex.schema.createTable("trip", table => {
        table.string("route_id", 128).notNullable();
        table.string("service_id", 128).notNullable();
        table.string("shape_id", 128);
        table.string("trip_id", 128);
        table.string("trip_headsign", 255);
        table.string("trip_short_name", 128);
        table.specificType("direction_id","char(1)");
        table.string("block_id", 128);
        table.specificType("wheelchair_accessible","char(1)").defaultTo("0");
        table.specificType("bikes_allowed","char(1)").defaultTo("0");
        table.string("feed_version", 255);
  
        table.primary(["trip_id", "feed_version"]);
        table.foreign(["service_id", "feed_version"]).references(["service_id", "feed_version"]).inTable("service").onDelete("CASCADE").onUpdate("CASCADE");
        table.foreign(["route_id", "feed_version"]).references(["route_id", "feed_version"]).inTable("route").onDelete("CASCADE").onUpdate("CASCADE");
        table.foreign("feed_version").references("id").inTable("feed_version").onDelete("CASCADE").onUpdate("CASCADE");
        table.index('feed_version');
        
        })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable("trip");
  };
  