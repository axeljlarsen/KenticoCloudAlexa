const lib = require('lib');
const request = require('request');

/**
* Basic "Recommend" intent, can receive a `name` parameter
* @param {string} recipe Your name
* @returns {string}
*/
module.exports = (recipe = '', callback) => {
  var url = 'https://deliver.kenticocloud.com/6608c037-89fe-405b-815f-f495c02788eb/items?system.type=recipe&elements.name=' + recipe.replace(/\s/, '%20');

  request({
    url: url,
    json: true
    }, function (error, response, body) {

    if (!error && response.statusCode === 200) {      
      var randomIndex = Math.floor(Math.random() * response.body.items.length);
      var theRecipe = response.body.items[randomIndex].elements;
      var content = response.body.modular_content;

      var recipeText = 'The ' + recipe + ' recipe calls for the following ingredients: ';
      var recipeIngredients = theRecipe.ingredients.value;
      for (var i = 0; i < recipeIngredients.length; i++) {
        var ingredient = content[recipeIngredients[i]].elements;
        recipeText += ' ' + ingredient.amount.value + ' ' + ingredient.name.value + '.';
      }

      recipeText += ' Follow these steps to make the ' + recipe + ' recipe: ';
      var recipeInstructions = theRecipe.instructions.value;
      for (var i = 0; i < recipeInstructions.length; i++) {
        var instruction = content[recipeInstructions[i]].elements;
        var instructionPlainText = instruction.instruction.value.replace(/(<([^>]+)>)/ig,'');
        recipeText += ' Step ' + (i + 1) + ', ' + instruction.name.value + ': ' + instructionPlainText;
      }

      return callback(null, recipeText);      
    }
  });
};
