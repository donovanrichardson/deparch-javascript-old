const agencies = {
    // bart: ["bart/58", 'San Francisco BART'], // bart download link not working
    boston: ["mbta/64", 'Boston MBTA'],
    lirr: ["mta/86", 'Long Island Rail Road'],
    // "maryland-mta": ["mta-maryland/247", "Maryland MTA"], //need to fix location type
    "mta-subway": ["mta/79", 'New York City Subway'],
    "septa-bus":["septa/263", 'SEPTA Bus'], // the most recent version of this uses non-standard direction_ids that break the import
    "septa-rail":["septa/262", 'SEPTA Rail'],

    
}

export default agencies