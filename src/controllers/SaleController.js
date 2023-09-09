const SalesModel = require('../models/SalesModel')

// Create Product
exports.CreateProduct = async (req, res) => {
	try {
		const { product, quantity, price, date } = req.body;

		if (!product.trim())
			return res.json({ error: "product name is required" });
		if (!quantity) return res.json({ error: "quantity is required" });
		if (!price) return res.json({ error: "price is required" });

		const newProduct = await new SalesModel({	product, quantity, price, date,}).save();

		res.json(newProduct);

	} catch (err) {
		console.log(err.message);
		return res.json(err.message);
	}
};
exports.ReadProduct = async (req, res) => {
	try {
		const data = await SalesModel.find();
		res.json(data);
	} catch (err) {
		console.log(err.message);
		return res.json(err.message);
	}
};


exports.TotalRevenue = async (req, res)=>{
      try {
        const totalSum = {
          $group: {
            _id: 0,
            sum: { $sum: { $multiply: ["$price", "$quantity"] } },
          },
        };
        const sumOfTotalRevenue = await SalesModel.aggregate([totalSum]);
        res.json({ data: sumOfTotalRevenue });
      } catch (err) {
        console.log(err.message);
        return res.json(err.message);
      }
}

exports.QuantityByProduct = async (req, res) => {
	try {
		const totalQuantityOfProducts = {
			$group: {
				_id: "$product",
				quantities: { $sum: "$quantity" },
			},
		};
		const totalQuantity = await SalesModel.aggregate([totalQuantityOfProducts]);
		res.json({ data: totalQuantity });
	} catch (err) {
		console.log(err.message);
		return res.json(err.message);
	}
};
exports.TopProducts = async (req, res) => {
	try {
		const totalRevenueProducts = {
			$group: {
				_id: "$product",
				totalRevenue: { $sum: { $multiply: ["$quantity", "$price"] } },
			},
		};
		const sortingByHighestRevenue = { $sort: { totalRevenue: -1 } };
		const limitingProducts = { $limit: 5 };

		const topRevenuedProducts = await SalesModel.aggregate([
			totalRevenueProducts,
			sortingByHighestRevenue,
			limitingProducts,
		]);
		res.json({ data: topRevenuedProducts });
	} catch (err) {
		console.log(err.message);
		return res.json(err.message);
	}
};
exports.AveragePrice = async (req, res) => {
	try {
		const avgPrice = {
			$group: {
				_id: 0,
				avgPrice: { $avg: "$price" },
			},
		};
		const productAveragePrice = await SalesModel.aggregate([avgPrice]);
		res.json({ data: productAveragePrice[0]?.avgPrice || 0 });
	} catch (err) {
		console.log(err.message);
		return res.json(err.message);
	}
};


exports.RevenueByMonth = async (req, res) => {
	try {
		const totalRevenueByDate = {
			$group: {
				_id: { month: { $month: "$date" }, year: { $year: "$date" } },
				totalRevenue: { $sum: { $multiply: ["$quantity", "$price"] } },
			},
		};
		const monthField = {
			$addFields: {
				monthName: {
					$let: {
						vars: {
							monthsInString: [
								"January",
								"February",
								"March",
								"April",
								"May",
								"June",
								"July",
								"August",
								"September",
								"October",
								"November",
								"December",
							],
						},
						in: {
							$arrayElemAt: [
								"$$monthsInString",
								{ $subtract: ["$_id.month", 1] },
							],
						},
					},
				},
			},
		};
		const projectByMonthAndYear = {
			$project: {
				_id: 0,
				year: "$_id.year",
				month: "$_id.month",
				totalRevenue: 1,
				monthName: 1,
			},
		};
		const revenueByMonth = await SalesModel.aggregate([
			totalRevenueByDate,
			monthField,
			projectByMonthAndYear,
		]);
		res.json({ data: revenueByMonth });
	} catch (err) {
		console.log(err.message);
		return res.json(err.message);
	}
};


exports.HighestQuantitySold = async (req, res) => {
	try {
		const maxQuantity = {
			$group: {
				_id: "$product",
				maxQuantitySold: { $max: "$quantity" },
			},
		};
		const sortingByMax = { $sort: { maxQuantitySold: -1 } };
		const limitToMaxSoldProduct = { $limit: 1 };

		const highestSoldProductIs = await SalesModel.aggregate([
			maxQuantity,
			sortingByMax,
			limitToMaxSoldProduct,
		]);
		res.json({ data: highestSoldProductIs });
	} catch (err) {
		console.log(err.message);
		return res.json(err.message);
	}
};



  