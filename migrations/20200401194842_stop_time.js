
exports.up = function(knex) {
    return knex.schema.createTable("stop_time", table => {
        table.string("trip_id", 128);
        table.string("arrival_time", 8);
        table.string("departure_time", 8);
        table.string("stop_id", 128).notNullable();
        table.integer("stop_sequence");
        table.string("stop_headsign", 128);
        table.integer("pickup_type").defaultTo(0);
        table.integer("drop_off_type").defaultTo(0);
        table.float("shape_dist_traveled", 15);
        table.integer("timepoint").defaultTo(1);
        table.string("feed_version", 255);
  
        table.primary(["trip_id", "stop_sequence", "feed_version"]);
        table.foreign(["trip_id", "feed_version"]).references(["trip_id", "feed_version"]).inTable("trip").onDelete("CASCADE").onUpdate("CASCADE");
        table.foreign(["stop_id", "feed_version"]).references(["stop_id", "feed_version"]).inTable("stop").onDelete("CASCADE").onUpdate("CASCADE");
        table.foreign("feed_version").references("id").inTable("feed_version").onDelete("CASCADE").onUpdate("CASCADE");
        })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable("stop_time");
  };
  