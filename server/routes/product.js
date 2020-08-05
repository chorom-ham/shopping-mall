const express = require("express");
const router = express.Router();
const multer = require("multer");
const { Product } = require("../models/Product");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

var upload = multer({ storage: storage }).single("file");

//=================================
//             Product
//=================================

router.post("/image", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.json({
      success: true,
      filePath: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

//보내준 정보 데베에 저장
router.post("/", (req, res) => {
  const product = new Product(req.body);
  product.save((err) => {
    if (err) {
      return res.status(400).json({ success: false, err });
    }
    return res.status(200).json({
      success: true,
    });
  });
});

//product collection의 모든 상품 정보 가져오기
router.post("/products", (req, res) => {
  let limit = req.body.limit ? parseInt(req.body.limit) : 20;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;
  let term = req.body.searchTerm;

  let findArgs = {};
  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      //여기서 key == category
      if (key === "price") {
        findArgs[key] = {
          $gte: req.body.filters[key][0], //greater than equal
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  if (term) {
    Product.find(findArgs)
      .find({ $text: { $search: term } })
      .populate("writer")
      .skip(skip)
      .limit(limit)
      .exec((err, productInfo) => {
        if (err) {
          return res.status(400).json({ success: false, err });
        }
        return res.status(200).json({
          success: true,
          productInfo,
          postSize: productInfo.length,
        });
      });
  } else {
    Product.find(findArgs) //product collection안의 모든 정보 찾는 메소드(원하는 조건은 파라미터로)
      .populate("writer")
      .skip(skip)
      .limit(limit)
      .exec((err, productInfo) => {
        if (err) {
          return res.status(400).json({ success: false, err });
        }
        return res.status(200).json({
          success: true,
          productInfo,
          postSize: productInfo.length,
        });
      });
  }
});

router.get("/products_by_id", (req, res) => {
  //쿼리스트링은 req.query로 값 가져옴
  let type = req.query.type;
  let productId = req.query.id;

  //get방식은 뒤에 json이 아니라 send로 답 보내줌
  Product.find({ _id: productId })
    .populate("writer")
    .exec((err, product) => {
      if (err) {
        return res.status(400).send(err);
      }
      return res.status(200).send({ success: true, product });
    });
});

module.exports = router;
