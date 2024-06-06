function rebaseProfile(img, minElev, maxElev) {
  const wd = img.bitmap.width;
  const ht = img.bitmap.height;
  const black = 0x000000ff;

  for (let y = ht - 2; y > 1; --y) {
    for (let x = 1; x < wd - 2; ++x) {
      if (img.getPixelColor(x, y) === black) {
        pxPerFt = y / (maxElev - minElev);
        base = (ht - y) / pxPerFt;
        minElev1 = minElev - base;
        minElev2 = Math.round(minElev1 / 10, 0) * 10;
        return minElev2;
      }
    }
  }
}
module.exports = { rebaseProfile };
