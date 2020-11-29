import express from 'express'

const router = express.Router()

// router.use()

router.get("/about", async (req, res) => {
 return res.json({
  message: "Tudo ok!"
 })
})

export default router