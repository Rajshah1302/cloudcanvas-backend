const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

//Create a User using: POST "api/auth". Doesn't require Auth
router.post('/',[
    body('name','Invalid name').isLength({min : 3}),
    body('email','Invalid Email').isEmail(),
    body('password','Password must be atleast 8 characters long').isLength({min:8}),
    
],async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      }).then(user => res.json(user)).catch(err=>{
        console.log(err)
        res.json({error:'Enter Unique email value'})
    });
})

module.exports = router;