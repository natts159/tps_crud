const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = require('../utils/toThousand');
const toDiscount = require('../utils/toDiscount');

const controller = {
	// Root - Show all products
	index: (req, res) => {
		const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

		return res.render('products',{
			products,
			toThousand,
			toDiscount
		})
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

		return res.render('detail',{
			product : products.find(product => product.id === +req.params.id),
			toDiscount,
			toThousand
		})
	},

	// Create - Form to create
	create: (req, res) => {
		return res.render('product-create-form')
	},
	
	// Create -  Method to store
	store: (req, res) => {
			const {name,price,discount,category,description} = req.body;
			let lastId = 1;

		products.forEach(product => {
			if(product.id > lastId){
				lastId = product.id
			}
		})

			let product = {
				id: lastId + 1 , 
				name: name.trim(),
				price: +price ,
				discount: +discount,
				category,
				description: description.trim(),
				image: 'default-image.png'
			}
			products.push(product)
	
			fs.writeFileSync(path.join(__dirname,'..', 'data', 'productsDataBase.json'), JSON.stringify(products,null,3), 'utf-8')
	
			res.redirect('/products')
	},

	// Update - Form to edit
	edit: (req, res) => {
		return res.render('product-edit-form',{
			product: products.find(product => product.id === +req.params.id)
		})
	},
	// Update - Method to update
	update: (req, res) => {
		const {name,price,discount,category,description} = req.body;

			let productModified = {
				id: +req.params.id ,
				name: name.trim(),
				price: +price ,
				discount: +discount,
				category,
				description: description.trim(),
				image: 'default-image.png'
			}
			
			let productsModified = products.map(product => product.id === +req.params.id ? productModified : product)
	
			fs.writeFileSync(path.join(__dirname,'..', 'data', 'productsDataBase.json'),JSON.stringify(productsModified,null,3), 'utf-8');
	
			res.redirect('/products/detail/' + req.params.id)
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		let productsModified = products.filter(product => product.id !== +req.params.id );

		fs.writeFileSync(path.join(__dirname,'..', 'data', 'productsDataBase.json'),JSON.stringify(productsModified,null,3), 'utf-8');

		res.redirect('/products')

	}
};

module.exports = controller;