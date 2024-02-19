import User from "../models/user.model.js"
import bcrypt from "bcrypt"
import json from "jsonwebtoken"

const userSignup = async (req, res) => {
    try {
        console.log(req.body)
        const { firstName, lastName, email, password } = req.body

        if (firstName && lastName && email && password) {

            // const userEmail = await User.find({ email })

            const newUser = new User(req.body)
            await newUser.save()

            res.json({
                status: "success",
                message: "User Signup Successfull",
                data: newUser
            })

        } else {
            res.json({
                status: "failed",
                message: "Provide All required fields",
            })
        }
    }

    catch (error) {
        console.log(error)

        res.json({
            status: "failed",
            message: error.message
        })
    }
}

const userLogin = async (req, res) => {
    try {

        const { firstName, lastName, email, password } = req.body

        if (firstName && lastName && email) {

            const hashedPassword = await bcrypt.hash(password, 10)

            const token = json.sign({
                firstName,
                lastName,
                email,
                hashedPassword
            },
                process.env.securityKey,
                { expiresIn: "1d" })

            console.log(token)


            res.json({
                status: "success",
                message: "User logged In successfully",
                token: token
            })
        } else {
            res.json({
                status: "failed",
                message: "Name is not correct",
            })
        }

    } catch (error) {




    }
}

const getUserDetails = async (req, res) => {
    try {
        const { email } = req.params

        const user = await User.find(email)
        console.log(user)

        res.json({
            status: "failed",
            message: "User Details",
            details: user
        })


    } catch (error) {
        res.json({
            status: "failed",
            message: "Details doesn't found",
        })
    }
}

const forgetPassword = async (req, res) => {

    const { email, old_password, new_password } = req.body
    console.log(req.body)

    const user = await User.findOne({ email })
    console.log(user.password)

    if (user.email) {
        if (old_password && new_password) {
            // check password
            const verifyPassword = await bcrypt.compare(old_password, password)
            console.log(verifyPassword)

            if (verifyPassword) {
                const newHashedPassword = await bcrypt.hash(new_password, 10)

                User.password = newHashedPassword

                res.json({
                    status: "success",
                    message: "password changed",
                })
            }

        } else {
            res.json({
                status: "failed",
                message: "password doesn't match",
            })
        }
    }
    else {
        res.json({
            status: "failed",
            message: "email doesn't found",
        })
    }


}

const resetPassword = async (req, res) => {


    try {
        const { email } = req.body

        if (email) {

            //username, email exists or not
            const existUser = await User.findOne({ email })


            if (existUser) {

                const generateOTP = () => {
                    return Math.floor(1000 + Math.random() * 9000).toString()
                }
                existUser.otp = generateOTP()
                const userOtp = existUser.otp
                console.log(userOtp, "122")

                const user = await User.findOneAndUpdate({ email }, { $set: { otp: userOtp } }, { new: true })

                //nodemailer config
                let config = {
                    service: "gmail",
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.PASSWORD
                    }
                }

                let transporter = nodemailer.createTransport(config);

                let mailOptions = {
                    from: process.env.EMAIL,
                    to: email,
                    subject: "OTP TO RESET PASSWORD",
                    text: `Your OTP is: ${userOtp}`
                }


                // /this method send email
                transporter.sendMail(mailOptions, (error, info) => {
                    if (!error) {
                        res.status(200).json({
                            message: 'Email has been sent',
                            info: info.messageId,
                            preview: nodemailer.getTestMessageUrl(info)
                        })
                        console.log(info.response, "258")
                    } else {
                        console.log('Error occurred', error);
                    }
                })
                return res.status(200).json({
                    status: "success",
                    message: "OTP send Successfully",
                    userOtp
                })

            } else {
                return res.status(422).json({
                    status: "fail",
                    message: "Wrong Email or username",
                    error: error.message
                })
            }


        }
        else {
            return res.status(422).json({
                status: "fail",
                message: "Please provide username or email",
                error: error.message
            })
        }

    } catch (error) {
        console.log("ERROR: ", error)
    }


}




export {
    userSignup,
    userLogin,
    getUserDetails,
    forgetPassword,
    resetPassword
}