const mongoose = require("mongoose")
const DrugSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true,
        
    },
    generic_name: {
        type:String,
        required: true,
        default: "N/A"
        
    },
    drug_classification: {
        type:[],
        required: true,
        default: ["N/A"]
        
    }, 
    description: { 
        type: String,
        required: true,
    },
    source_info:{
        type: String,
        default: "The data for this drug was gathered from https://www.drugs.com "
    }
  

})
DrugSchema.index({'$**': 'text'});


const Drug = mongoose.model("Drug", DrugSchema)

module.exports = Drug