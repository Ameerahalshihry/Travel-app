const geoNamesApiUrl = 'http://api.geonames.org/searchJSON?q='
const userName = 'ameerahalshihry'
const weatherbitKey = '89ade9e53a8c414baed5a21c8e9347e1'
const forecastWeatherbitApiUrl = 'http://api.weatherbit.io/v2.0/forecast/daily?'
const currentWeatherbitApiUrl= 'http://api.weatherbit.io/v2.0/current?'
const pixabayApiUrl='https://pixabay.com/api/?key='
const pixabayKey='17918367-5aa98d0c79e6d52feae8e15c6'


export const handleSubmit = (event) =>{
    event.preventDefault()
    const destination = document.querySelector('#destination').value
    const startDate = document.querySelector('#start-date').value
    const endDate = document.querySelector('#end-date').value
    getInfo(destination)
        .then((result) => {
            let d = new Date()
            let todayDate = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`
            let diffDays= Math.floor((new Date(startDate)-new Date(todayDate))/(1000*60*60*24))
            let city = result.geonames[0].name
            let country = result.geonames[0].countryName
            let longitude = result.geonames[0].lng
            let latitude = result.geonames[0].lat
            postInfo('http://localhost:8081/add', {
                city,
                country,
                longitude,
                latitude
                })
            getWeather(diffDays, latitude, longitude)
                .then((result)=>{
                    updateUI(result, startDate, destination, endDate, diffDays )
                    const result1 = document.querySelector('.result')
                    result1.scrollIntoView({behavior: "smooth"});
                    getImage(destination)
                        .then((res) =>{
                            document.querySelector('img').src=res.hits[0].webformatURL
                        })
                    })
            })
}


export const getInfo = async (destination) => {
    const response = await fetch (geoNamesApiUrl + destination + '&username=' + userName + '&maxRows=1')
        try{
            const destinationInfo = await response.json()
            return destinationInfo
        }catch (err){
            console.log('ERROR is' + err)
        }
}

export const postInfo = async (url ='', data = {}) => {
    const res = await fetch (url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    try{
        const newData = await res.json()
        console.log(newData);
        return newData
    }catch(err){
        console.log('ERROR is'+ err);
        
    }
}

export const getWeather = async (diffDays, lat, lon, destination)=>{
    if(diffDays <= 7){
        const response = await fetch (currentWeatherbitApiUrl + 'lat='+ lat + '&lon='+ lon + '&key=' + weatherbitKey)
        try{
            const weatherInfo = await response.json()
            return weatherInfo
        }catch(err){
            console.log('ERROR is ' + err);
        }
    }
    else{
        const response = await fetch (forecastWeatherbitApiUrl + 'lat='+ lat + '&lon='+ lon + '&key=' + weatherbitKey)
        try{
            const weatherInfo = await response.json()
            return weatherInfo
        }catch(err){
            console.log('ERROR is ' + err)
        }
    }
}
export const updateUI = async (info, startDate, destination, endDate, diffDays)=>{
    let q=0
    if(diffDays > 7 && diffDays <= 15 ){
        q = diffDays
    }else if (diffDays > 15){
        q = 15
    }
    // console.log(q);
    let temp = info.data[q].temp
    let description = info.data[q].weather.description
    let humidity = info.data[q].rh
    let lengthOfTrip =  Math.floor((new Date(endDate)-new Date(startDate))/(1000*60*60*24))
    document.querySelector('.tripCity').innerHTML=`My trip to ${destination}`
    document.querySelector('.tripDate').innerHTML= `Departing: ${startDate}`
    document.querySelector('.temp').innerHTML=`The temperature  is: ${temp}`
    document.querySelector('.description').innerHTML=`The weather is ${description}`
    document.querySelector('.humidity').innerHTML=`The Relative humidity is: ${humidity}%`
    document.querySelector('.lengthTrip').innerHTML=`The length of trip are: ${lengthOfTrip} days`
    document.querySelector('.diffDays').innerHTML=`${diffDays} days remaining to start trip`
}
export const getImage =async (destination)=>{
    const response = await fetch (pixabayApiUrl + pixabayKey + '&q='+ destination)
    try{
        const pic = await response.json()
        return pic
    }catch(err){
        console.log(err);
    }
}
window.onload=function(){
document.querySelector('#btnSubmit').addEventListener('click', handleSubmit)
}
