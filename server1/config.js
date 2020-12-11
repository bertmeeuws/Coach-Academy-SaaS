exports.S3_ACCESS_KEY_ID =
  process.env.S3_ACCESS_KEY_ID || "nothing to see here";
exports.S3_SECRET_ACCESS_KEY =
  process.env.S3_SECRET_ACCESS_KEY_ID || "nothing to see here";
exports.S3_ENDPOINT =
  process.env.S3_ENDPOINT ||
  "https://coachacademyfiles.ams3.digitaloceanspaces.com";
exports.S3_BUCKET = process.env.S3_BUCKET || "weighins";
