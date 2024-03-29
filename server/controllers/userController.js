const User = require("../models/userModel");

/**
 * Creates a user
 *
 * @param {*} req
 * @param {*} res
 */
const userPost = (req, res) => {
    let user = new User();
    user.name = req.body.name;
    user.lastname = req.body.lastname;
    user.email = req.body.email;
    user.password = req.body.password;
    user.pin = req.body.pin;
    user.country = req.body.country;
    user.fechaNacimiento = req.body.fechaNacimiento;

    if (
        user.name &&
        user.lastname &&
        user.email &&
        user.password &&
        user.pin &&
        user.fechaNacimiento
    ) {
       
        let birthDate = new Date(user.fechaNacimiento);
        let today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        let month = today.getMonth() - birthDate.getMonth();

        if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 18) {
            return res.status(422).json({ error: 'You must be at least 18 years old to register' });
        }

        user.save()
            .then((savedUser) => {
                res.status(201).json(savedUser);
            })
            .catch((err) => {
                res.status(422).json({ error: 'There was an error saving the user' });
            });
    } else {
        res.status(422).json({ error: 'No valid data provided for user' });
    }
};



/**
 * Get all users
 *
 * @param {*} req
 * @param {*} res
 */
const userGet = async (req, res) => {
    try {
        const { email, password } = req.query; 
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        
        const user = await User.findOne({ email });

        // Verificar si el usuario existe
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        
        if (user.password !== password) {
            return res.status(401).json({ error: "Invalid password" });
        }

        
        return res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const loginGet = async (req, res) => {
    try {
        const { _id, pin } = req.query;
        if (!_id || !pin) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = await User.findOne({ _id });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.pin !== pin) {
            return res.status(401).json({ error: "Invalid password" });
        }
        return res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    userGet,
    userPost,
    loginGet
}