// Modules
const express =  require('express');
const api_helper = require('./api.js')
const publicIp = require('public-ip');

// Initializations
const app = express();
const PORT = process.env.PORT || 3000;

// Setting Static
app.use(express.static('public'));

// Settings Views
app.set('view engine', 'ejs');

// API Calls
let ip = '';
let city= ''; 
let countryCode = '';

app.get('/', (req, res) => {
    (async () => {
        ip = await publicIp.v4();
    })();

    let Location = `http://api.ipstack.com/${ip}?access_key=f7353db8fe71f3722470dcdc9049b516`;

    api_helper.make_API_call(Location)
    .then(response => {
        //console.log(response);
        city = response.city;
        countryCode = response.country_code;
    })
    .catch(error => {
        console.log(error)
    })

    let url = `http://api.aladhan.com/v1/timingsByCity?city=${city}&country=${countryCode}&school=0&method=1`;

    api_helper.make_API_call(url)
    .then(response => {

        if(response.data.timings !== undefined){
            res.render('index', {
                prayer: response.data.timings,
                city,
                countryCode,
            });
        }else{
            res.render('reload')
        }
        

    })
    .catch(error => {
        res.send(error)
    })

})


// Server
app.listen(PORT, ()=>{
    console.log(`Connected on PORT ${PORT}`);
})
