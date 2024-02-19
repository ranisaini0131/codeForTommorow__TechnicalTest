import express, { Router } from "express"
import { userSignup, userLogin, getUserDetails, forgetPassword, resetPassword } from "../controllers/user.controller.js";

const router = Router()

router.post("/userSignup", userSignup)
router.post("/userLogin", userLogin)
router.get("/getUserDetails/:id", getUserDetails)
router.patch("/forgetPassword", forgetPassword)
router.patch("/resetPassword", resetPassword)

export default router;