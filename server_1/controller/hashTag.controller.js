var express = require('express');
var hashTagModel = require('../model/hashtag.model');
var hashTagController = {};



hashTagController.addTag = function(req,res){
	// var hashTag = req.body.hashTag;
	var hashTag = new hashTagModel(req.body);	
	hashTagModel.findOne({hashTag:req.body.hashTag})
	.exec((err,foundTag)=>{
		if(err){
			res.status(500).send(err);
			console.log('err------------------>',err);
		}else if(foundTag){
			console.log('foundTag===============>',foundTag);
			foundTag.count++;
			foundTag.save();
			res.status(200).send(foundTag);

		}else{
			hashTag.save((err,tag)=>{
				if(err){
					res.status(500).send(err);
					console.log('err------------------>',err);
				}else{
					console.log('hastag=================>',tag);
					res.status(200).send(tag);
				}
			})

		}
	})
	

}


hashTagController.getTag = function(req,res){
	hashTagModel.find({},function(err,tag){
		if(err){
			res.status(500).send(err);
			console.log('err------------------>',err);
		}else{
		console.log('all tag====================>',tag);
		res.status(200).send(tag);
		}

	})
}



module.exports = hashTagController;