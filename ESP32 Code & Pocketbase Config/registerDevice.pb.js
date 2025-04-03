// register "GET /hello/{name}" route (allowed for everyone)
routerAdd("GET", "/hello/{name}", (e) => {
    let name = e.request.pathValue("name")

    return e.json(200, { "message": "Hello " + name })
})


routerAdd("POST", "/registerdevice", (e) => {
    let deviceid = e.request.url.query().get("deviceid")
    
    if(deviceid){
        try{
            let exists = $app.findFirstRecordByFilter(
                "devices",
                "id = {:deviceid}",
                { "deviceid": deviceid },
            )
            
            // exists already
            return e.json(200, {"message": "ID already registed"})
        }catch{
            let collection = $app.findCollectionByNameOrId("devices")

            let record = new Record(collection)

            record.set("id", deviceid)
            
            $app.save(record);
            
            return e.json(200, {"message": "Registered device"})
        }        
        
    }else{
        return e.json(400, {"message": "No device ID given in query"})
    }
})
