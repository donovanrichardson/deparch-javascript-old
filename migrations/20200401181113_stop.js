
exports.up = function(knex) {
  return knex.schema.createTable("stop", table => {
      table.string("stop_id", 128);
      table.string("stop_code", 64);
      table.string("stop_name", 128);
      table.text("stop_desc");
      table.string("stop_lat", 32);
      table.string("stop_lon", 32);
      table.text("stop_url");
      table.specificType("location_type","char(1)").defaultTo("0").notNullable();
      table.string("parent_station", 128);
      table.specificType("wheelchair_boarding","char(1)").defaultTo("0");
      table.string("feed_version", 255);

      table.primary(["stop_id", "feed_version"]);
      table.index("stop_name");
      table.index(["parent_station","feed_version"])//no more fk constraint bc the fks are present within the same table and won't be inserted in the correct order
      table.foreign("feed_version").references("id").inTable("feed_version").onDelete("CASCADE").onUpdate("CASCADE");
      })
};

exports.down = function(knex) {
  return knex.schema.dropTable("stop");
};
