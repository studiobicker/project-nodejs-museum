/*
  This is a file of data and helper functions that we can expose and use in our templating function
*/
// FS is a built in module to node that let's us read files from the system we're running on
const fs = require("fs");

// Some details about the site
exports.siteName = `Museums in Amsterdam`;

// inserting an SVG
exports.icon = name => fs.readFileSync(`./public/images/icons/${name}.svg`);

exports.menu = [
  { slug: "/museums", title: "Museums" },
  { slug: "/museums/map", title: "Map" },
  { slug: "/mylist", title: "My list" }
];

exports.adminmenu = [
  { slug: "/admin", title: "Dashboard", icon: "dashboard" },
  { slug: "/admin/museums", title: "Museums", icon: "museum" },
  { slug: "/admin/reviews", title: "Reviews", icon: "review" },
  { slug: "/admin/users", title: "Users", icon: "user" }
];
