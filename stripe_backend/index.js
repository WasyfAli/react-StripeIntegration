const cors = require("cors");
const express = require("express");
const stripe = require("stripe")("SECRET_KEY");
const uuid = require("uuid/v4");





const app = express();



//middleware

app.use(express.json());
app.use(cors());



//routes
app.get("/", (req, res) =>{
    res.send("It works");
});

app.post("/payment", (req,res) =>{

        const {product, token} = req.body;
        console.log("PRODUCT", product);
        console.log("PRICE", product.price);
        //This keeps tract that user wont charge twice for anything
        const idempotencyKey = uuid();

        return stripe.customers.create({
            email: token.email,
            source: token.id
        }).then(customer => {
            stripe.charges.create({
                amoount: product.price * 100,
                currency: 'usd',
                customer: customer.id,
                reciept_email: token.email,
                description: `Purchase of ${product.name}`,
                shipping: {
                    name: token.card.name,
                    address: {
                        country: token.card.address_country
                    }
                }
            }, {idempotencyKey})
        }).then(result => res.status(200).json(result))
        .catch(err => console.log(err));
        
        
});


//listen

app.listen(8282, () => console.log("App listen on 8282"));