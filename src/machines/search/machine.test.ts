const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': 'd9010e8ae7msheb3f58872a18a0bp1b1dccjsne6a4ff0af4b2',
    'X-RapidAPI-Host': 'newsdata2.p.rapidapi.com',
  },
};

fetch('https://newsdata2.p.rapidapi.com/archive', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));

export {};
