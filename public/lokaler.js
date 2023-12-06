const { default: Lokale } = require("@/entities/lokale");

const rooms = [
  new Lokale("406", "10", false),
  new Lokale("400", "6", true),
  new Lokale("306", "4", false),
  new Lokale("304", "6", true),
  new Lokale("206", "6", false),
  new Lokale("204", "4", true),
];
export default rooms;
