const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');


var app = express();
//view engine setup
app.listen(3000,() => console.log('server started!'));


app.engine('handlebars',exphbs());
app.set('view engine','handlebars');

// Static folder

app.use('/public',express.static(path.join(__dirname,'public')));
// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/',(req,res) => {
	res.render('contact');
});
app.post('/send',(req,res) => {
	console.log(req.body);
	const output = `
		<p>You have a new contact request</p>
		<h3>Contact Details</h3>
		<ul>
			<li>Name: ${req.body.name}</li>
			<li>Company: ${req.body.company}</li>
			<li>Email: ${req.body.email}</li>
			<li>Phone: ${req.body.phone}</li>
		</ul>
		<h3>Message</h3>
		<p>${req.body.message}</p>
	`;

	 // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        service: 'gmail',
        secure: true, // true for 465, false for other ports
        auth: {
        		 type: xoauth2,
        		 user: 'manoj.y554@gmail.com', // generated ethereal user
           		 // pass: 'Pa@scue77'  // generated ethereal password
     			 cliendId: '93861602561-9f5bu55o49gbnr5nk77ipvoeckkrps3j.apps.googleusercontent.com',
     			 cliendSecret: 'oNfmw9_tRBJo2VsxmoXaWwnT',
     			 refreshToken:'1/AhRazyzTwXIZFqEzwahFdN57K9X_NHCMmBwfyngNV94LPazaljeCXmmr6ydghOKP'
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Its nodemailer manoj 👻" <manoj.y554@gmail.com>', // sender address
        to: 'yerrapotu.kiran@gmail.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }else{
            res.redirect('/');
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

        res.render('contact',{msg:'email has been sent'});
    });
});

