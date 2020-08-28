import "regenerator-runtime";
import "./nav.js";
import "./api.js";
import "./db.js";
import "./idb.js";
import "./time.js";
import	"../node_modules/moment/moment.js";
import sw from "../service-worker.js";
document.addEventListener("DOMContentLoaded", sw);