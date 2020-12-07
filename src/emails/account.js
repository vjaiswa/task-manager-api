const sgmail = require('@sendgrid/mail')
sgmail.setApiKey(process.env.SENDGRID_API_KEY)
sgmail.send({
    from:"jais_myvijay@yahoo.co.in",
    to:"jais.myvijay@gmail.com",
    subject:"Testing",
    text:"How are you!"
})
