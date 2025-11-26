const auth = require("../middleware/auth");

router.get("/", auth, getMenu);
router.post("/", auth, addMenu);
