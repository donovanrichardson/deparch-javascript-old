const {localImp, prodfeeds} = require('./api')

prodfeeds()
localImp('mta/86')
// localImp('septa/262')
// localImp('mta/79')
// localImp('mbta/64')

//\{(.*?)('.*?')(.*?)\},*$ -> localImp($2)