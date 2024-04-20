import Email from "../models/Emailschema.js";
import nodemailer from "nodemailer"

export const createEmail = async (req, res) => {


    const { email, subject, message } = req.body;

    console.log(process.env.GMAIL_APP_PASSWORD);

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'medibook001@gmail.com',
            pass: process.env.GMAIL_APP_PASSWORD
        }
    });

    let mailOptions = {
        from: 'medibook001@gmail.com',
        to: `${email}`,
        subject: 'Reply mail',
        text: ` Thank you for your feedback. we'll respond to you quickly.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error occurred:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });



    if (!req.body.user) {
        req.body.user = req.userID
    }
    
    const newEmail = new Email(req.body);

    try {
        const savedEmail = await newEmail.save();
        res.status(200).json({message: "email sent successfully" , success : "true" , data: savedEmail})
        
    } catch (error) {
        res.status(500).json({message: "oops! email not sent " , success : "false" , err: error})
    }
}