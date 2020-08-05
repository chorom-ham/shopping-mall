const express = require("express");
const router = express.Router();
const { User } = require("../models/User");

const { auth } = require("../middleware/auth");

//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

router.post("/register", (req, res) => {
  const user = new User(req.body);

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({
        loginSuccess: false,
        message: "Auth failed, email not found",
      });

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: "Wrong password" });

      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res.cookie("w_authExp", user.tokenExp);
        res.cookie("w_auth", user.token).status(200).json({
          loginSuccess: true,
          userId: user._id,
        });
      });
    });
  });
});

router.get("/logout", auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    { token: "", tokenExp: "" },
    (err, doc) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
      });
    }
  );
});

router.get("/addToCart", auth, (req, res) => {
  //아래처럼 유저 아이디 들고 올 수 있는 이유? auth 미들웨어 덕분(쿠키로 유저 정보 저장)
  //auth 미들웨어를 통과하는 순간 req.id에 유저 정보 담김
  User.findOne({ _id: req.user._id }, (err, userInfo) => {
    //가져 온 정보에서 카트에 추가하려는 상품이 이미 카트에 있는 지 확인
    //있으면 개수만 추가
    let duplicate = false;
    userInfo.cart.forEach((item) => {
      if (item.id === req.body.productId) {
        duplicate = true;
      }
    });
    if (duplicate) {
      User.findByIdAndUpdate(
        { _id: req.user._id, "cart.id": req.body.productId },
        { $inc: { "cart.$.quantity": 1 } },
        { new: true }, //업데이트 된 정보의 결과값을 받으려면 new: true 옵션 줘야함
        (err, userInfo) => {
          if (err) return res.json({ success: false, err });
          return res.status(200).send(userInfo.cart);
        }
      );
    } else {
      User.findByIdAndUpdate(
        { _id: req.user._id },
        {
          $push: {
            cart: {
              id: req.query.productId,
              quantity: 1,
              date: Date.now(),
            },
          },
        },
        { new: true }, //업데이트 된 정보의 결과값을 받으려면 new: true 옵션 줘야함
        (err, userInfo) => {
          if (err) return res.json({ success: false, err });
          return res.status(200).send(userInfo.cart);
        }
      );
    }
  });
});

module.exports = router;
