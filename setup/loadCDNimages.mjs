import "dotenv/config";
import getenv from "getenv";
// dotenv.config();
import db from "../server/galleryDB.js";
import jetpack from "fs-jetpack";
import fetch from "node-fetch";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: getenv("CLOUNDINARY_cloud_name"),
  api_key: getenv.string("CLOUNDINARY_api_key"),
  api_secret: getenv("CLOUNDINARY_api_secret"),
});

// import { v2 as cloudinary } from "cloudinary";
// if (getenv("CLOUNDINARY_api_key") !== "557948671947414")
//   console.log(getenv("CLOUNDINARY_api_key"), "557948671947414");
// cloudinary.config({
//   cloud_name: "stedswards",
//   api_key: "557948671947414",
//   api_secret: "mBMAR0Szu4gETSXYx0hA2ZXMOAc",
// });
// console.log(process.env);
async function load() {
  let next_cursor;
  const uploaded = new Set();
  do {
    const result = await cloudinary.api.resources({
      type: "upload",
      max_results: 500,
      next_cursor,
    });
    const { resources, ...rest } = result;
    next_cursor = rest.next_cursor;
    for (const { public_id } of resources) {
      uploaded.add(public_id);
    }
    console.log("rest", rest);
  } while (next_cursor);
  jetpack.write("./upload.json", Array.from(uploaded));
  // const year = "2023";
  const years = jetpack.inspectTree("../gallery", {
    relativePath: true,
  });
  // console.log("2023", years);
  for (const yearDir of years.children) {
    const year = yearDir.name;
    for (const album of yearDir.children ?? []) {
      const folder = `${year}/${album.name}`;
      // console.log("album", album);
      for (const { name } of album.children ?? []) {
        const id = `${folder}/${name}`;
        if (uploaded.has(id)) continue;
        if (name.startsWith(".")) {
          console.log("ignoring", id);
          continue;
        }
        const pic = `../gallery/${id}`;
        console.log("pict", pic);

        if (name.includes("~")) {
          console.log("delete", pic);
          jetpack.remove(pic);
        } else {
          try {
            await cloudinary.uploader.upload(pic, {
              public_id: name,
              folder,
              unique_filename: true,
              overwrite: true,
            });
            // await loadPic(name, folder);
          } catch (error) {
            console.error("error", id, error);
          }
        }
      }
    }
  }
}
await load();
