// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const cors = require('cors')({origin: true});

let transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 25,
    secure: false,
    requireTLS: true,
    auth: {
        user: 'mattbendel60@gmail.com',
        pass: 'Rosso54321!'
    }
});

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

exports.updateDeviceAndNotify = functions.https.onRequest(async (req, res) => {
    let {battery} = req.body;
    let {liquid} = req.body;
    let {device} = req.body;
    let newDevice = false;
    let notifRef = admin.firestore().collection('notifications').doc(device);

    await admin.firestore().collection('devices').doc(device).update({
        percentBattery: battery+'%',
        percentLiquid: liquid+'%',
    }).catch((e) => {
        if (e) {
            newDevice = true;
            admin.firestore().collection('devices').doc(device).set({
                percentBattery: battery+'%',
                percentLiquid: liquid+'%',
                userEmail: '',
            });
        }
    });

    if (newDevice) {
        return res.status(200).send('Success: Device Added');
    }

    let mailOptions = {
        from: 'mattbendel60@gmail.com', // Something like: Jane Doe <janedoe@gmail.com>
        to: '',
        subject: 'Your ECE 4900 Capstone Notification', // email subject
        html: ``
    };

    let send = false;
    await notifRef.get().then((data) => {
        mailOptions.to = data.data().email;

        if (battery <= 5 && data.data().lowBattery) {
            mailOptions.html += `
                <h4>Your battery needs recharged. It is less than 5%.</h4>
            `;
            send = true;
        }

        if (liquid <= 5 && data.data().lowLiquid) {
            mailOptions.html += `
                <h4>Your disinfectant needs refilled. There is currently less than 5% remaining.</h4>
            `;
            send = true;
        }

        if (battery >= 99 && data.data().recharged) {
            mailOptions.html += `
                <h4>Your battery has been recharged.</h4>
            `;
            send = true;
        }

        if (liquid >= 99 && data.data().refilled) {
            mailOptions.html += `
                <h4>Your disinfectant has been refilled.</h4>
            `;
            send = true;
        }
    });

    console.log( mailOptions.to);
    if (!send) {
        return res.status(200).send('Success: No Email');
    }
    return transporter.sendMail(mailOptions, (erro, info) => {
        if(erro){
            console.log(erro.message);
            return res.send('Error');
        }
        return res.status(200).send('Success: Email');
    });
});

