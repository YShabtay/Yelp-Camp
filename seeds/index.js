
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedsHelpers')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 100; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author:'64bebd278d53507caf205216',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price  ,
            geometry: {
                type: "Point",
                coordinates: [cities[random1000].longitude,
            cities[random1000].latitude,
            ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dfmrhqoxw/image/upload/v1690713323/YelpCamp/dscwfphis10rery7abmy.jpg',
                    filename: 'YelpCamp/cuklbmwmbtk8yzcuo7na',
              
                }
            ] 
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})

