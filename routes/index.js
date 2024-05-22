var express = require('express');
var router = express.Router();
const userModel = require('../models/users');
const expenseModel = require('../models/expense');
const contactModel = require('../models/contact')
const passport = require('passport');
const localStrategy = require("passport-local");
const { default: mongoose } = require('mongoose');
passport.use(new localStrategy(userModel.authenticate()))


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});
router.get('/about', function (req, res, next) {
  res.render('about');
});
router.get('/contact', function (req, res, next) {
  const sentmsg = req.flash('sentmsg')
  res.render('contact', {sentmsg});
});

router.post('/contact', async function(req, res) {
  const {fullname, email, message} = req.body;
  const contactDetails = await contactModel.create({fullname, email, message})
  req.flash('sentmsg', 'Message sent')
  res.redirect('/contact')
})

router.get('/expense', isloggedIn, async function (req, res, next) {
  try{
    const user = await userModel.findOne({username: req.session.passport.user});   
    if(!user){res.status(400).send("user not found")}
    if(user.limit === 0){
      req.flash("msg", "Please set your limit first")
      return res.redirect("/profile")
    }
    if(user.usedBudget >= user.limit){
      req.flash('msg', "Your limit exceeded can't add more expenses")
      return res.redirect("/profile")
    }
    res.render('expense');
  }
  catch(err){
    console.log(err);
  }
});

router.get('/viewExpense', async function (req, res, next) {
  try {
    const user = await userModel.findOne({ username: req.session.passport.user })
    const userExpenses = await expenseModel.find({ user: user._id })
      .populate("catagories");
    let tempamount = 0;
    userExpenses.forEach(function (expense) {
      expense.catagories.forEach(function (e) {
        tempamount += parseInt(e.amount);
      })
    })
    user.usedBudget = tempamount;
    // console.log(userExpenses);
    res.render("userExpense", { userExpenses, limit: user.limit, usedBudget: user.usedBudget });
  }
  catch (e) {
    res.redirect("/login")
  }
});

router.post('/add', async function (req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user })
  const { catagory, expensename, amount } = req.body;
  const data = { expenseType: catagory, expenseName: expensename, amount: amount }
  const expenseData = await expenseModel.create({
    user: user._id,
    catagories: data
  })
  user.expenses.push(expenseData._id);
  user.usedBudget += Number.parseInt(amount);
  await user.save();
  req.flash('msg', 'Expense added successfully')
  res.redirect("/profile");
});

router.delete('/expenses/:expenseId', async (req, res) => {
  try {

    const user = await userModel.findOne({ username: req.session.passport.user })
    const expenses = await expenseModel.find({ user: user._id });
    console.log(expenses);
    const { expenseId } = req.params;
    const index = parseInt(expenseId); // Convert to integer in case it's a string

    if (isNaN(index) || index < 0 || index >= expenses.length) {
      return res.status(404).json({ error: 'Invalid expense index' });
    }
    const expenseToDelete = expenses[index]; // Get the expense using the index
    user.usedBudget -= expenseToDelete.catagories[0].amount;
    await user.save()
    const {ObjectId} = mongoose.Types;
    await expenseModel.deleteOne({ _id: expenseToDelete._id });
    const result = await userModel.updateOne(
      { _id: user._id },
      { $pull: { expenses: new ObjectId(expenseToDelete._id)} },
    );
    res.status(200).json({ message: 'Category removed successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post("/getIndex", async function (req, res) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  const expenses = await expenseModel.find({ user: user._id })
  const data = req.body
  console.log(data);
  const indexToDelete = expenses.findIndex(expense => {
    return expense.catagories[0].expenseType.trim() === data.expenseType &&
      expense.catagories[0].expenseName.trim() === data.expenseName &&
      expense.catagories[0].amount.trim() == data.amount;
  });
  res.json({ index: indexToDelete })
})

router.get('/budget', function (req, res) {
  res.render('budget')
})

router.post('/getbudget', async function (req, res) {
  try {
    let budget = req.body.budget;
    const user = await userModel.findOne({ username: req.session.passport.user });
    const expenses = await expenseModel.find({ user: user._id })
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Update or create the budget limit for the user
    user.limit = budget;
    const { ObjectId } = mongoose.Types;
    user.usedBudget = 0;
    expenses.forEach(async (e) => {
      await e.deleteOne({_id: e._id})
      const result = await userModel.updateOne(
        { _id: user._id },
        { $pull: { expenses: new ObjectId(e._id)} },
      );
    })
    await user.save();
    let msg = req.flash('msg', "Budget limit saved successfully")
    res.redirect("/profile");
  } catch (error) {
    console.error("Error setting budget limit:", error);
    res.status(500).send("Internal Server Error");
  }
})

router.get('/login', function (req, res, next) {
  res.render('login', { error: req.flash("error") });
});

router.get('/register', function (req, res, next) {
  const error = req.flash('err');
  res.render('register', {error});
});

router.get('/profile', isloggedIn, async function (req, res, next) {
  const userData = await userModel.findOne({
    username: req.session.passport.user
  })
  const msg = req.flash('msg')[0]
  res.render('profile', { userData: userData, msg: msg });
});

// router.post("/register", function (req, res) {
//   const { username, email, fullname } = req.body
//   let userData = new userModel({ username, email, fullname })
//   userModel.register(userData, req.body.password)
//     .then(function () {
//       passport.authenticate("local")(req, res, function () {
//         res.redirect("/profile")
//       })
//     })
// })
router.post("/register", async function (req, res) {
  const { username, email, fullname } = req.body;
  let userData = new userModel({ username, email, fullname });
  try {
    await userModel.register(userData, req.body.password);
    passport.authenticate("local")(req, res, function () {
      res.redirect("/profile");
    });
  } catch (error) {
    // Check if the error is a UserExistsError
    if (error.name === 'UserExistsError') {
      // Handle the error, such as sending a message to the user or redirecting
      req.flash("err", "Username is already registered.");
      res.redirect("/register")
    } else {
      // Handle other types of errors
      res.status(500).send("Internal server error.");
    }
  }
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true
}), function (req, res) {
})

router.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) { return next(err) }
    res.redirect("/")
  })
})

function isloggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login")
}

module.exports = router;
