import express from 'express'
import Fred from 'node-fred'
const router = express.Router()

router.get('/test', async (req, res, next) => {
    const fred = new Fred('85144884658e7115e855ba2292bdd561')
    const categories = await fred.categories.getCategory(125).catch(err => res.send(err))
    res.send(categories)
});

export default router
