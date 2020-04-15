const Router = require('express').Router()
const controller = require('./../2_controllers/products')

Router.get('/',controller.getAllProduct)
Router.get('/:id',controller.getProductById)
Router.post('/',controller.postNewProduct)
Router.delete('/:id',controller.deleteProduct)
Router.post('/image/',controller.postImageByIdProduct)
Router.delete('/image/:id',controller.deleteImageById)
Router.patch('/image/:id',controller.editImageById)
Router.get('/image/:id_image',controller.getIdProductByIdImage)

    


module.exports= Router