const { Faker } = require('@faker-js/faker');
const faker = new Faker({ locale: 'en_IND' }); // Adjust the locale as needed`
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema
const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        url: String,
        filename: String
    },
    price: Number,
    location: String,
    country: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});

// Create the model
const Listing = mongoose.model('Listing', listingSchema);

// Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/your_database', { useNewUrlParser: true, useUnifiedTopology: true });

// Function to generate random coordinates within a range
function randomCoordinates(center, radiusInMeters) {
    // Convert radius from meters to degrees
    const radiusInDegrees = radiusInMeters / 111300;

    const u = Math.random();
    const v = Math.random();
    const w = radiusInDegrees * Math.sqrt(u);
    const t = 2 * Math.PI * v;
    const x = w * Math.cos(t);
    const y = w * Math.sin(t);

    // Adjust the x-coordinate for the shrinking of the east-west distances
    const new_x = x / Math.cos(center[1]);

    const new_longitude = new_x + center[0];
    const new_latitude = y + center[1];

    return [new_longitude, new_latitude];
}

// Generate 50 travel listings
for (let i = 0; i < 5; i++) {
    const title = faker.lorem.words(5);
    const description = faker.lorem.paragraph();
    const imageUrl = faker.image.imageUrl();
    const price = faker.datatype.number({ min: 10, max: 500 });
    const location = faker.address.city();
    const country = faker.address.country();
    const coordinates = randomCoordinates([faker.address.longitude(), faker.address.latitude()], 5000); // Adjust the radius as needed

    const listing = new Listing({
        title,
        description,
        image: { url: imageUrl, filename: '' },
        price,
        location,
        country,
        geometry: {
            type: 'Point',
            coordinates
        }
    });
    console.log(listing)
    // listing.save()
    //     .then(() => console.log('Listing saved:', listing.title))
    //     .catch(err => console.error('Error saving listing:', err));
}
