const db =require('./../3_databases/mysql')
const fileUpload = require('./../helpers/fileUpload')
 const fs = require('fs')

 function convertPath(param) {
    var path = param.split('public')
    path[0] = 'public/'
    return path.join('')
}


function convertPath1(param) {
    var path = param.split('public')
    path[0] = 'public'
    return path.join('')
}

console.log(convertPath1('public\PRD-IMG-1586921901549.jpeg'))



const getAllProduct = (req,res)=>{
    const sql = `select * from products p
    left join product_images i
    on p.id =i.id_product;`

    db.query(sql,(err,result)=>{
        try{
            if(err) throw err
            res.json({
               error : false,
               data : result
                
            })

        }catch(err){
            res.json({
                error : true,
                message : err.message
            })
        }
    })
}

const getProductById =(req,res)=>{
    const sql = `select p.id as product_id,name,price,created_at,i.id as image_id,image_url from products p
    left join product_images i
    on p.id =i.id_product where p.id=?;`

    db.query(sql,req.params.id,(err,result)=>{
        try{
            if(err) throw err
            res.json({
               error : false,
               data : result
                
            })

        }catch(err){
            res.json({
                error : true,
                message : err.message
            })
        }
    })
}          
const getIdProductByIdImage = (req,res) =>{
    let sql = `select p.id as product_id,name,price,created_at,i.id as image_id,image_url from products p
    left join product_images i
    on p.id =i.id_product where i.id=?;`
    

    db.query(sql,req.params.id_image,(err,result)=>{
        try{
            if(err) throw err
            res.json({
               error : false,
               data : result
                
            })

        }catch(err){
            res.json({
                error : true,
                message : err.message
            })
        }
    })

}


const postNewProduct = (req,res) => {
        console.log('masuk')
        const upload = fileUpload.array('product-images')    
        upload(req,res,(err) => {
            try{
                let isFailed = false
                if(err) throw err
                console.log(req.files)
                req.files.forEach((file) => {
                    // check each file size
                    if(file.size > 1000000){
                        isFailed = true
                    }
    
                    // check each file type
                    if(!file.mimetype.includes('image')){
                        isFailed = true
                    }
                })
    
                if(isFailed){
                    // delete all failed file
                    req.files.forEach((file) => {
                        fs.unlinkSync(file.path)
                    })
                    throw {error : true , message : "all file must be image and below 1 mb"}
                }else{
                    console.log(req.files)
                    let data = req.body.data
                    console.log(data)
                    data = JSON.parse(data)
                    console.log(data)
    
    
                    // post data to databases
    
                    // post product name and price to products table
                    let sql_1 = 'insert into products set ?'
                    db.query(sql_1,data,(err,result) => {
                        try{    
                            if(err) throw err
    
                            console.log(result.insertId)
    
                            // looping to make array of object
                            // let dataProductImages = req.files.map((file) => {
                            //     return{
                            //         image_url : file.path,
                            //         id_product : result.insertId
                            //     }
                            // })
    
                            // console.log(dataProductImages)
    
                            // looping for generate query multiple insert
                            let sql_2 = 'insert into product_images (image_url,id_product) values'
                            req.files.forEach((file,index) => {
                                if(index === req.files.length -1){
                                    sql_2 += `("${convertPath(file.path)}" , ${result.insertId});`
                                }else{
                                    sql_2 += `("${convertPath(file.path)}" , ${result.insertId}),`
                                }
                            })

                            console.log(sql_2)                    
                            // dataProductImages.forEach((data,index) => {
                            //     if(index === dataProductImages.length -1){
                            //         sql_2 += `("${data.image_url}" , ${data.id_product});`
                            //     }else{
                            //         sql_2 += `("${data.image_url}" , ${data.id_product}),`
                            //     }
                            // })
    
                            // post multiple data image url to product images
                            db.query(sql_2 , (err,result) =>{
                                try{
                                    if(err) throw err
                                    res.json({
                                        error : false,
                                        message : "product successfully added"
                                    })
                                }catch(err){
                                    res.json({
                                        error : true,
                                        message : err.message
                                    })
                                }
                            }) 
                        }catch(err){
                            res.json({
                                error : true,
                                message : err.message
                            })
                        }
                    })
                }         
            }catch(err){
                res.json(err)
                console.log(err)
            }
        })
    }

    const deleteProduct=(req,res)=>{
        const id = req.params.id       
        sql1 = 'delete from products where id=?'
        db.query(sql1,id,(err) => {
            try{
                if(err) throw err
                
                let sql2 = 'select image_url from product_images where id_product=?'
                db.query(sql2,id,(err,result) => {
                  try{
                    if(err) throw err
                    console.log('ini result')
                    console.log(result)

                    result.forEach((val)=>{
                        fs.unlinkSync(val.image_url)
                    })
                   
                    sql3 = 'delete from product_images where id_product=?'
                    db.query(sql3,id,(err,result) => {
                        try{
                            if(err) throw err                            
                        }catch(err){
                            res.json({
                                error : true,
                                message : err.message
                                })
                            }
                        })               
                    }catch(err){    
                        res.json({
                            error : true,
                            message : err.message
                        })
                    }   
                })
    
    
                res.json({
                    error : false,
                    message : "Delete Product Success"
                })

            }catch(err){
                res.json({
                    error : true,
                    message : err.message
                })
            }
        })

    }


    const postImageByIdProduct =(req,res)=>{
        const upload = fileUpload.single('new-image')    
        upload(req,res,(err) => {
            try{
                if(err) throw err
                    const id = req.body.id_product
                    console.log(req.file)
                    console.log(req.file.path)                     
                   
                      let sql_2 = `insert into product_images (image_url,id_product) values("${convertPath(req.file.path)}",${id})`  
                            db.query(sql_2 ,(err,result) =>{
                                try{
                                    if(err) throw err
                                    res.json({
                                        error : false,
                                        message : "image successfully added"                                      
                                    })
                                }catch(err){
                                    res.json({
                                        error : true,
                                        message : err.message
                                    })
                                }
                            }) 
                  
            }catch(err){
                res.json(err)
                console.log(err)
            }
        })

    }


    const deleteImageById = (req,res) => {
        const id = req.params.id
        let sql = 'select image_url from product_images where id = ?'
        db.query(sql,id,(err,result) => {
            try{
                if(err) throw err
                fs.unlinkSync(result[0].image_url)
                sql = 'delete from product_images where id = ?'
                db.query(sql,id,(err,result) => {
                    try{
                        if(err) throw err
                        res.json({
                            error : false,
                            message : "Delete Image Success"
                        })
                    }catch(err){
                        res.json({
                            error : true,
                            message : err.message
                        })
                    }
                })
            }catch(err){    
                res.json({
                    error : true,
                    message : err.message
                })
            }   
        })
        // delete url_image di database
        // delete image nya di api
    }
    
    
    const editImageById = (req,res) => {
   
        const upload = fileUpload.single('editImage')
        // post image to api
        upload(req,res,(err) => {
            try{
                if(err) throw err
    
                // check all the data needed
                console.log(req.file)
                const newPath = req.file.path
                const oldPath = req.body.path
                const idImage = req.params.id
                console.log(newPath)
                console.log(oldPath)
                console.log(idImage)
                let dataPath = {image_url : newPath}
                // delete old image from api
                fs.unlinkSync(oldPath)
    
                // edit image path at database
                let sql = 'update product_images set ? where id = ?'
                db.query(sql,[ dataPath , idImage],(err,result) => {
                    try{
                        if(err) throw err
                        res.json({
                            error : false,
                            message : "Edit Data Success"
                        })
                    }catch(err){
                        console.log(err)
                    }
                })
    
    
    
            }catch(err){
                console.log(err)
            }
        })
        // post image ke api
        // delete old image from api
        // edit image_url di database
    }
    


               

            

       

module.exports = {
    getAllProduct : getAllProduct,
    getProductById : getProductById,
    postNewProduct : postNewProduct,
    deleteImageById :deleteImageById,
    editImageById : editImageById,
    getIdProductByIdImage : getIdProductByIdImage,
    deleteProduct : deleteProduct,
    postImageByIdProduct : postImageByIdProduct
}













     // const editImageById = (req,res) => {     
        //     let id = req.params.id  
        //     let sql = 'select image_url from product_images where id = ?'
        //     db.query(sql,id,(err,result) => {
        //         try{
        //             if(err) throw err
        //             console.log(result[0].image_url)
        //             fs.unlinkSync(result[0].image_url)
    
        //             const update = fileUpload.single('product-image') 
        //             update(req,res,(err)=>{
        //                 try{
        //                     if(err) throw err
        //                     console.log(req.file)
        //                     // let id = req.params.id
        //                   let sql_2= `UPDATE product_images SET image_url="${convertPath(req.file.path)}"WHERE id=?`
        //                       db.query(sql_2,id, (err,result) =>{
        //                             try{
        //                                 if(err) throw err
        //                                 res.json({
        //                                     error : false,
        //                                      message : "product successfully updated"
        //                                 })
        //                             }catch(err){
        //                                 res.json({
        //                                     error : true,
        //                                     message : err.message
        //                                 })
        //                             }
    
        //                         }) 
        //                 }catch(err){
        //                     res.json(err)
        //                     console.log(err)
        //                 }
        //             })
    
    
        //         }catch(err){    
        //             res.json({
        //                 error : true,
        //                 message : err.message
        //             })
        //         }   
        //     })   
            
        // }