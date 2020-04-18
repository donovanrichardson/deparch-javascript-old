
exports.up = function(knex) {
    return knex.schema.createTable("shape", table => {
        table.string("shape_id", 128).notNullable();;
        table.float("shape_pt_lat", 15, 12).notNullable();
        table.float("shape_pt_lon", 15, 12).notNullable();
        table.integer("shape_pt_sequence").unsigned().notNullable();
        table.string("shape_dist_traveled", 15, 32);
        table.string("feed_version", 255);
  
        table.primary(["shape_id","shape_pt_sequence", "feed_version"]);
        table.foreign("feed_version").references("id").inTable("feed_version").onDelete("CASCADE").onUpdate("CASCADE");
        table.index("feed_version");
        })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable("shape");
  };
  