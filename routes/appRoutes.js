const router = require('express').Router()
const  path = require('path')
const Drug = require('../mongo/Models/Drug')
const { LogMessage }= require("../utils/LogMessage")

/**
 * @route - /api/help
 * @desc - return documentation to the user along with a welcome message
 */
router.route('/').get(async ( req , res ) => {
    req.setTimeout(10000, ()=>{
        return res.json("timed out request")
    })
    LogMessage(' GET ' , 'Documentation', `requested documentation @ '/'`)
    res.sendFile(path.resolve(__dirname,'readme.md'), (err)=>console.error(err))
    //res.send('==Drug Dictionary API== Look for information on usage and pricing')
})

/**
 * @route /api/drugs/:drugname
 * @params { drugname : String }
 * @desc – searches through the db for a drug with matching name to req.params.drugname
 */
router.route('/drugs/:drugname').get(async ( req , res ) => {
    req.setTimeout(10000, ()=>{
        return res.json("timed out request")
    })
    let drugname = req.params.drugname
    if(drugname.split("_").length > 1){
        drugname = drugname.split("_").join(" ")
    }
    
    try {
        const drug = await Drug.find({ name: drugname })
        LogMessage('GET',` Requested ${drugname}` , drug && `Successfully got ${drugname} data from mongodb, respond with json ${JSON.stringify(drug).substring(0,120)}`, "",null )
        if( drug ){ 
            return res.status(200).json({
                success: true,
                drug: {
                    ...drug
                },
                
            })
        }
        else {
            return res.status(404).json({ 
                success: false, 
                message: `No drug found with the name ${drugname}` 
            })
        }
    } catch (error) {
        LogMessage("ERR", "Error", null , null , null , new Error(error))
        return res.status(500).json(error)
    }
})



/**
 * @route /api/drugs/starts-with/:pattern
 * @params { pattern : String }
 * @desc – collects all drug documents starting with the specified pattern in the params (can be a single letter or multiple letters)
 */
router.route('/drugs/starts-with/:pattern').get(async ( req , res ) => {
    req.setTimeout(10000, ()=>{
        return res.json("timed out request")
    })
    const drugs = await Drug.find({});
    const pattern = req.params.pattern;
    
    const result = drugs.map( drug => ({
        "name": drug.name,
        "generic_name": drug.generic_name,
        "drug_classification": drug.drug_classification,
        "description": drug.description,
        
    }
    )).filter( item => String(item.name).startsWith(pattern))
    
    LogMessage("GET",`requested: Drugs starting with "${pattern}"`,`  Found ${result.length} drugs`)
    res.json({itemCount: result.length ,data:result})
})


function getPercentMatch( a , b ){
    let common = 0
    a.split("").forEach(letter => {
        if( b.search(letter) ){
            common++
        }
    })
    console.log( common / b.length)
    return common / b.length
}

function checkClassifications( test , classificationsArray){
    classificationsArray.forEach( classification => {
        if(getPercentMatch(test, classification) > 0.5){
            return true
        }
        else return false
    })
}
/**
 * @route /api/drugs/of-class/:classification
 * @params { classification : String }
 * @desc – collects all drug documents found with the specified drug class and returns to user.
 */
router.route('/drugs/of-class/:classification').get(async ( req , res ) => {
    req.setTimeout(10000, ()=>{
        return res.json("timed out request")
    })
    const drugs = await Drug.find({})
    var qry = req.params.classification.replace("_"," ")
    while(qry.includes('_')){
        qry = qry.replace('_'," ")
    }
    const result = drugs.map( drug => ({
        "name": drug.name,
        "generic_name": drug.generic_name,
        "drug_classification": drug.drug_classification,
        "description": drug.description,
    })).filter(item => item.drug_classification.includes(qry) || qry.includes(item.drug_classification) )
    LogMessage("GET",`Requested ${qry}`,`Got ${result.length} results`)
    res.json(result)
})


/**
 * @route /api/search/:keyword
 * @params { keyword : String }
 * @desc – does a search through string fields of each document in the database to find a particular keyword. Returns all documents containing keyword
 */
router.route('/search/:keyword').get( async ( req , res ) => {
    req.setTimeout(10000, ()=>{
        return res.json("timed out request")
    })
    
    let keyword = req.params.keyword;
    
    if(keyword.split("_") > 1){
        keyword = keyword.split("_")[0]
    }
    
    if( keyword.length < 3 || keyword.includes("_")) {
        res.json("aborted search due to keyword being too short or having invalid characters. Ensure you are only passing in one keyword")
    }
    
    try{
        const drugs = await Drug.find({$text: { $search: keyword}})
        if( drugs.length > 0){
            LogMessage('GET',`Searched for ${keyword}`, `Recieved ${drugs.length} results`)
            return res.json(drugs)
        }

    } catch( error ) { 
        LogMessage("ERR","Error in search", "","", new Error(error))
        return 
    }
    
})



module.exports = router;
