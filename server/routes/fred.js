const express = require('express');
const Fred = require("node-fred");
const router = express.Router();

/* GET users listing. */
router.get('/test', async (req, res, next) => {
    const fred = new Fred('85144884658e7115e855ba2292bdd561');
    const categories = await fred.categories.getCategory(125).catch(err => res.send(err));
    res.send(categories);
});

module.exports = router;
