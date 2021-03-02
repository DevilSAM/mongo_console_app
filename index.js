const ObjectId = require('mongodb').ObjectID;

let arg1 = process.argv[2];
let arg2 = process.argv[3];

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'seminarOne';
const client = new MongoClient(url, {useUnifiedTopology: true});

// Use connect method to connect to the server
client.connect(function(err) {
    assert.equal(null, err);
    //console.log('Connected successfully to server');

    const db = client.db(dbName);

    // поиск машин по производителю
    const findByManufacture = async function(db, manuf) {
      console.log(manuf)
        const allCars = await db.collection('mycars').find({manufacture: manuf}).project({manufacture:1, model:1}).toArray();
        console.log(allCars); 
        console.log(`Всего: ${allCars.length} автомобилей`)
        await client.close();
    };

    // поиск машин новее указанного года
    const findNewer = async function(db, someyear) {
        const newerCars = await db.collection('mycars').aggregate([{$match: {year: {$gte: someyear}}}]).toArray();
        console.log(newerCars); 
        await client.close();
    };


    // вывод опций по ID авто
    const findOptions = async function(db, id) {
        const newerCars = await db.collection('mycars').find({"_id": ObjectId(id)}).project({car_options:1, _id:0}).toArray();
        console.log(newerCars[0]['car_options']); 
        await client.close();
    };



    if (arg1 == "manufacture") {
        findByManufacture(db, arg2.charAt(0).toUpperCase() + arg2.slice(1));

    } else if (arg1 == "later_then") {
        findNewer(db, parseInt(arg2, 10));

    } else if (arg1 == "options") {
        findOptions(db, arg2);

    } else if (arg1 == "help") {
        console.log("Список доступных команд:\n")
        console.log("manufacture <name>  // поиск авто по производителю name\n")
        console.log("later_then <year>  // поиск авто с годом выпуска >= year\n")
        console.log("options <id>  // просмотр опций у авто с _id == id\n")
        client.close();

    } else {
        console.log("Ошибка в аргументах. Попробуйте команду 'help'\n")
        client.close();
    }


});