// const db = require("./walkDB.js");
const sequelize = require("sequelize");
const { Op } = require("sequelize");
const fetch = require("node-fetch");

const fs = require("fs");
const util = require("util");
const path = require("path");
const { isOkForRole } = require("./authRoutes.js");
const getenv = require("getenv");

const dateFn = require("date-fns");
const jetpack = require("fs-jetpack");
const { read, exists, write, cwd } = jetpack;
const { format, addMonths } = dateFn;
// const { Op } = sequelize;

async function webCollectRoutes(fastify, options) {
  fastify.get("/", async (request, reply) => {
    return "hello world";
  });

  fastify.get("/bookings/:start/:end?", async (request, reply) => {
    let { start, end } = request.params;
    if (!end) end = format(addMonths(new Date(), 14), "dd-MM-yyyy");
    const res = await fetch(
      `https://webcollect.org.uk/api/v1/stedwardsfellwalkers/event/bookings?start_date=${start}&end_date=${end}`,
      {
        headers: {
          Authorization:
            "Bearer YWK5SZZNFNHAEW5WW65MU86MZR2M74X2ZXRBWZXGC5V2B9NP5YDZJP3YNQGO6X8O",
        },
      }
    );
    return await res.json();
  });
  fastify.get("/:id", async (request, reply) => {
    return await db.event.findByPk(request.params.id, {
      include: { model: db.display, order: ["where"] },
    });
  });
}
module.exports = { webCollectRoutes };
