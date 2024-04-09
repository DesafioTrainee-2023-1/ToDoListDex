/* imports */
require('dotenv').config() //vai pegar os dados sensiveis que estao na maquina, coloca dados od mongoDB
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt') // faz manuseio das senhas
const jwt = require('jsonwebtoken')

const app = express() // esta variavel vai dar inicio às rotas, endpoints

// Config JSON response
app.use(express.json()) // aplicacao passa a aceitar json

// Models
const User = require('./models/User')
/* rota de teste para o postman
   quando uma rota é criada no express, se tem a requisicao e a resposta ao dispor,
   pode-se pegar dados da requisicao e enviar dados na resposta 
*/
app.get('/', (req,res) => {   // Public Route, rota que vai ser acessivel por qualquer um q queira entrar no sist.
    res.status(200).json({msg:'Bem vindo a nossa API!'})
})

// Private Route
app.get("user/:id", checkToken, async(req, res) => {

    const id = req.params.id

    // check if user exists
    const user = await User.findById(id, '-password')

    if(!user) {
        return res.status(404).json({msg: 'Usuário não encontrado'})
    }

    res.status(200).json({ user })

})

function checkToken(req, res, next){

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]

    if(!token){
        return res.status(401).json({ msg: 'Acesso negado!' })
    }

    try{

        secret = process.env.SECRET

        jwt.verify(token, secret)

        next()
    } catch(error){
        res.status(400).json({ msg: "Token inválido!"})
    }
}

// Register User
app.post('/auth/register', async(req, res) => {

    const {name, email, password, confirmpassword} = req.body

    //validations
    if(!name){
        return res.status(422).json({msg: 'O nome é obrigatório'})
    }
    if(!email){
        return res.status(422).json({msg: 'O email é obrigatório'})
    }
    if(!password){
        return res.status(422).json({msg: 'A senha é obrigatória'})
    }

    if(password != confirmpassword) {
        return res.status(422).json({msg :'POr favor, utilize outro email'})
        
    //check if user exists
    const userExists = await User.findOne({email: email})

    if(userExists){
        return res.status(422).json({msg: 'Por favor, utilize outro email!'})
    }
    

    //create password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    //create User
    const user = new User({
        name,
        email,
        password: passwordHash,
    })

    try{
        await user.save()

        res.status(201).json({msg: 'Usuário criado com sucesso'})
    }catch(error) {
        console.log(error)

        res.status(500).json({msg:'Aconteceu um erro no servidor, tente mais tarde'})
    }
}})

// Login User
app.post("/auth/login", async(req, res) => {
    
    const {email, password} = req.body

    //validations 
    if(!email){
        return res.status(422).json({msg: 'O email é obrigatório'})
    }
    if(!password){
        return res.status(422).json({msg: 'A senha é obrigatória'})
    }

    // check if user exists
    const user = await User.findOne({email: email})

    if(!user){
        return res.status(404).json({msg: 'Usuário não encontrado!'})
    }

    //check if password exists
    const checkpassword = await bcrypt.compare(password, user.password)

    if(!checkpassword){
        return res.status(422).json({msg: 'Senha inválida!'})
    }

    try{
        const secret = process.env.SECRET

        const token = jwt.sign(
            {
            id: user_id
            }, 
            secret,
        )

        res.status(200).json({msg: 'Autenticação realizada com sucesso', token})

    } catch(err){
        console.log(err)

        res.status(500).json({msg:'Aconteceu um erro no servidor, tente mais tarde'})
    }
})

//Credentials
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

mongoose.connect('mongodb+srv://vimersonSilva:ctPJzrxrEqdPlMVg@cluster0.6m18srv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => {
    app.listen(3000)
    console.log("Conectou ao banco!")
}).catch((error) => console.log(error))
/* [app.listen(3000)] ==> concretiza o inicio da aplicacao, 
disponibiliza o acesso a api na porta 3000 do pc,
 ao acessar esta porta, conseguirá ver o que se tem na API */