
exports.up = function(knex) {
    return knex.schema.createTable("stop_time", table => {
        table.string("trip_id", 128);
        table.string("arrival_time", 8);
        table.string("departure_time", 8);
        table.string("stop_id", 128).notNullable();
        table.integer("stop_sequence").unsigned().notNullable();
        table.string("stop_headsign", 128);
        table.specificType("pickup_type",'char(1)').defaultTo('0');
        table.specificType("drop_off_type",'char(1)').defaultTo('0');
        table.string("shape_dist_traveled", 32);
        table.specificType("timepoint",'char(1)').defaultTo('1');
        table.string("feed_version", 255);
  
        table.primary(["trip_id", "stop_sequence", "feed_version"]);
        table.foreign(["trip_id", "feed_version"]).references(["trip_id", "feed_version"]).inTable("trip").onDelete("CASCADE").onUpdate("CASCADE");
        table.foreign(["stop_id", "feed_version"]).references(["stop_id", "feed_version"]).inTable("stop").onDelete("CASCADE").onUpdate("CASCADE");
        table.foreign("feed_version").references("id").inTable("feed_version").onDelete("CASCADE").onUpdate("CASCADE");
        table.index("feed_version");
        table.index("stop_id");
        })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable("stop_time");
  };
  

  
// exports.up = function(knex) {
//   return knex.schema.createTable("stop_time", table => {
//       table.string("trip_id", 128);
//       table.string("arrival_time", 8);
//       table.string("departure_time", 8);
//       table.string("stop_id", 128).notNullable();
//       table.integer("stop_sequence").notNullable();
//       table.string("stop_headsign", 128);
//       table.specificType("pickup_type","char(1)").defaultTo("0");
//       table.specificType("drop_off_type","char(1)").defaultTo("0");
//       table.string("shape_dist_traveled", 32);
//       table.specificType("timepoint","char(1)").defaultTo("1");
//       table.string("feed_version", 255);

//       table.primary(["trip_id", "stop_sequence", "feed_version"]);
//       table.foreign(["trip_id", "feed_version"]).references(["trip_id", "feed_version"]).inTable("trip").onDelete("CASCADE").onUpdate("CASCADE");
//       table.foreign(["stop_id", "feed_version"]).references(["stop_id", "feed_version"]).inTable("stop").onDelete("CASCADE").onUpdate("CASCADE");
//       table.foreign("feed_version").references("id").inTable("feed_version").onDelete("CASCADE").onUpdate("CASCADE");
//       })
// };

// exports.down = function(knex) {
//   return knex.schema.dropTable("stop_time");
// };
