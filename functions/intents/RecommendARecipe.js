const lib = require('lib');
const request = require('request');

/**
* Basic "Recommend" intent, can receive a `name` parameter
* @param {string} name Your name
* @param {string} meat Meat name
* @param {string} meal Meal name
* @param {string} occasion Occassion name
* @param {string} difficulty Difficulty name
* @returns {string}
*/
module.exports = (name = '', meat = '', meal = '', occasion = '', difficulty = '', callback) => {
  var authorFilter = (name == '') ? '' : '&elements.author[contains]=' + name;
  var meatFilter = (meat == '') ? '' : '&elements.meat[contains]=' + meat;
  var mealFilter = (meal == '') ? '' : '&elements.meal[contains]=' + meal;
  var occasionFilter = (occasion == '') ? '' : '&elements.occasion[contains]=' + occasion;
  var difficultyFilter = (difficulty == '') ? '' : '&elements.difficulty[contains]=' + difficulty;
  var url = 'https://deliver.kenticocloud.com/6608c037-89fe-405b-815f-f495c02788eb/items?system.type=recipe' +
             authorFilter + meatFilter + mealFilter + occasionFilter + difficultyFilter;

  request({
    url: url,
    json: true
    }, function (error, response, body) {

    if (!error && response.statusCode === 200) {      
      var randomIndex = Math.floor(Math.random() * response.body.items.length);
      var theRecipe = response.body.items[randomIndex].elements;
      var recommendationText = name + ' recommends the ' + theRecipe.name.value + ' recipe. ' + theRecipe.description.value.replace(/(<([^>]+)>)/ig,'');
      return callback(null, recommendationText); 
    }
  });
};
