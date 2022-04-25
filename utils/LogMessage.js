const fs = require("fs")

function hBar( length ){
    let idx = 0;
    let hBar = ""
    while( idx < length ){
        hBar+="- "
        idx++
    }
    return hBar
}


exports.LogMessage = ( type , title , log , table , error ) => {
    const logHeader = `| LOG [${type}] - ${title} |`
    const hBarLength = logHeader.length + 3
    const myHbar = hBar( hBarLength )
    console.log(myHbar)
    
    let logString = ""
    logString += myHbar + "\n" + logHeader + "\n" 
    
    
    
    console.log(logHeader)
    try{
        if( log ){
            console.log(log)
            logString += log
        }
        
        if(table){
            console.table(table);
            logString += table.toString()
        }

        if(error){
            console.error('❌ FAILED')
            console.error(error.message.substring(0,100) + ' . . . ')
            console.log(myHbar + '\n')
            logString += " ❌ Failed\n"+ error.message.substring(0,100)+ " . . . \n" + myHbar + "\n"
        }
        else{
            if( type === "ERR" ){
                logString += `🔴[${type}]`
                console.log(` 🔴[${type}] `);

            }
            else{
                logString += `✅ SUCCESS`
                console.log(` ✅ SUCCESS `)
            }

        }
        
    } catch ( error ) {
       return  this.LogMessage("ERR" , "Error" , "","", new Error(error))
    }
    
    console.log(myHbar + "\n")
    logString+= "\n" + myHbar + "\n"



    fs.appendFile('log.txt' , logString , ()=>{

    }) 
}

