const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');


// method for signup
exports.signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({ 
        username,
        email,
        verificationCode,
        password: hashedPassword
    
    });

    var result = await user.save();

    // send email
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
        },
    });

    await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: 'Verification Code',
        text: `Your verification code is ${verificationCode}`,
    });
    

    console.log(result);
    res.status(201).send('User registered');
  } catch (error) {
    res.status(400).send('Error registering user');
  }
};


// method for login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid password');

    const token = jwt.sign({ id: user._id }, 'secretkey');
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).send('Error logging in');
  }
};

// method for verify
exports.verify = async (req,res) => {

    const { email, code } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.verificationCode !== code) {
        return res.status(400).send('Invalid code');
    }

    if (user || user.verificationCode == code) {

        user.isVerified = true;
        user.verificationCode = null;
        await user.save();
    
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    
        return res.status(200).json({'status':'success' , 'message':'your email found here & your verification code is true ' , 'token' : token ,  'user' : user });

    }

};
