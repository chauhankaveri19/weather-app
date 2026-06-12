var key = 'bc200602aemsh7690c599f7552f2p106393jsn3de4b198294f';
var host = 'weatherapi-com.p.rapidapi.com';

function setText(id, text) {
  var element = document.getElementById(id);
  if (element) {
    element.textContent = text;
  }
}

function getValue(value, suffix) {
  if (value === null || value === undefined) {
    return '-';
  }
  return value + (suffix || '');
}

function getCloudValue(current) {
  if (current.cloud !== undefined && current.cloud !== null) {
    return current.cloud;
  }
  if (current.cloud_pct !== undefined && current.cloud_pct !== null) {
    return current.cloud_pct;
  }
  return null;
}

function show(city) {
  if (!city) {
    setText('weather-output', 'Please enter a city name.');
    return;
  }

  var url = 'https://' + host + '/forecast.json?q=' + encodeURIComponent(city) + '&days=1';

  fetch(url, {
    method: 'GET',
    headers: {
      'x-rapidapi-key': key,
      'x-rapidapi-host': host
    }
  })
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    if (data.error) {
      setText('weather-output', data.error.message || 'City not found.');
      return;
    }

    var current = data.current || {};
    var forecastDay = (data.forecast && data.forecast.forecastday && data.forecast.forecastday[0]) || {};
    var locationName = (data.location && data.location.name) ? data.location.name : city;

    setText('weather-title', 'Weather for ' + locationName);
    setText('cityName', locationName);
    setText('temp', getValue(current.temp_c, '°C'));
    setText('min_temp', forecastDay.day ? getValue(forecastDay.day.mintemp_c, '°C') : '-');
    setText('max_temp', forecastDay.day ? getValue(forecastDay.day.maxtemp_c, '°C') : '-');
    setText('cloud_pct', getValue(getCloudValue(current), '%'));
    setText('feels_like', getValue(current.feelslike_c, '°C'));
    setText('humidity_heading', getValue(current.humidity));
    setText('humidity_value', getValue(current.humidity));
    setText('wind_speed', getValue(current.wind_kph));
    setText('wind_speed_detail', getValue(current.wind_kph));
    setText('sunrise', forecastDay.astro ? getValue(forecastDay.astro.sunrise) : '-');
    setText('sunset', forecastDay.astro ? getValue(forecastDay.astro.sunset) : '-');
    setText('weather-output', '');
  })
  .catch(function() {
    setText('weather-output', 'Unable to load weather.');
  });
}

function fill() {
  var cities = ['Bangalore', 'Jaipur', 'Gandhinagar', 'Lucknow', 'Mumbai'];
  var body = document.getElementById('common-places-body');
  body.innerHTML = '';

  cities.forEach(function(city) {
    var url = 'https://' + host + '/forecast.json?q=' + encodeURIComponent(city) + '&days=1';

    fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': key,
        'x-rapidapi-host': host
      }
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var current = data.current || {};
      var forecastDay = (data.forecast && data.forecast.forecastday && data.forecast.forecastday[0]) || {};

      var row = '<tr>';
      row += '<th class="text-start">' + city + '</th>';
      row += '<td>' + getValue(getCloudValue(current), '%') + '</td>';
      row += '<td>' + getValue(current.temp_c) + '</td>';
      row += '<td>' + getValue(current.feelslike_c) + '</td>';
      row += '<td>' + getValue(current.humidity) + '</td>';
      row += '<td>' + (forecastDay.day ? getValue(forecastDay.day.mintemp_c) : '-') + '</td>';
      row += '<td>' + (forecastDay.day ? getValue(forecastDay.day.maxtemp_c) : '-') + '</td>';
      row += '<td>' + getValue(current.wind_kph) + '</td>';
      row += '<td>' + getValue(current.wind_degree) + '</td>';
      row += '<td>' + (forecastDay.astro ? getValue(forecastDay.astro.sunrise) : '-') + '</td>';
      row += '<td>' + (forecastDay.astro ? getValue(forecastDay.astro.sunset) : '-') + '</td>';
      row += '</tr>';

      body.innerHTML += row;
    })
    .catch(function() {
      body.innerHTML += '<tr><th class="text-start">' + city + '</th><td colspan="10">error</td></tr>';
    });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  var form = document.getElementById('city-search-form');
  if (form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      var input = document.getElementById('city');
      if (input && input.value) {
        show(input.value.trim());
      }
    });
  }

  fill();
});   