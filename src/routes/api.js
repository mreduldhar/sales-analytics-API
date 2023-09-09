const express = require('express');
const SaleController = require('../controllers/SaleController')

const router = express.Router();



router.post("/create-product", SaleController.CreateProduct)
router.get("/read-product", SaleController.ReadProduct)
router.get("/api/sales/total-revenue", SaleController.TotalRevenue)
router.get("/api/sales/quantity-by-product", SaleController.QuantityByProduct)
router.get("/api/sales/top-products", SaleController.TopProducts)
router.get("/api/sales/average-price", SaleController.AveragePrice)
router.get("/api/sales/revenue-by-month", SaleController.RevenueByMonth)
router.get("/api/sales/highest-quantity-sold",SaleController.HighestQuantitySold)




module.exports = router;