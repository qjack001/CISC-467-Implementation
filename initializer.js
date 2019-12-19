/*
	This is the implementation of the Coffee Brewing fuzzy expert system defined in my term paper.
	
	Author: Jack Guinane
	Last updated: 2019-06-18
*/


/*
	global variables (set up in init(), used in runFuzzySystem())
*/

// HTML input and output elements
var caffeine_input;
var body_input;
var acidity_input;
var sweetness_input;
var roast_output;
var brew_output;
var sugar_output;

// fuzzy input and output values
var caffeine;
var body;
var acidity;
var sweetness;

var roast;
var brew;
var sugar;

/*
	initializer function, runs on start
*/
function init()
{
	// create listener for header on scroll
	// blurs the background when the navigation is over content for better visibility
	var header = document.getElementById("header");
	window.addEventListener('scroll', function () { if(window.pageYOffset > 30) { header.className = "scroll"; } else { header.className = ""; }});
	
	// initialize the inputs and outputs
	caffeine_input = document.getElementById("caffeine-slider");
	body_input = document.getElementById("body-slider");
	acidity_input = document.getElementById("acid-slider");
	sweetness_input = document.getElementById("sweet-slider");
	roast_output = document.getElementById("roast-type");
	brew_output = document.getElementById("brew-type");
	sugar_output = document.getElementById("sugar-type");
	
	// create listener for each input slider
	// re-computes the result when a slider is updated
	caffeine_input.addEventListener("change", runFuzzySystem, false);
	body_input.addEventListener("change", runFuzzySystem, false);
	acidity_input.addEventListener("change", runFuzzySystem, false);
	sweetness_input.addEventListener("change", runFuzzySystem, false);
}

/*
	The steps defined in the paper
	Computes the result of the fuzzy expert system whenever an input is updatted
*/
function runFuzzySystem()
{	
	// initialize the measurable quantities
	// fuzzify the slider values
	caffeine =
	{
		value : caffeine_input.value,
		isLow : buildMembershipFunction(0, 0, 10, 45).getAt(caffeine_input.value),
		isMed : buildMembershipFunction(10, 45, 55, 90).getAt(caffeine_input.value),
		isHigh : buildMembershipFunction(55, 90, 100, 100).getAt(caffeine_input.value)
	}
	
	body =
	{
		value : body_input.value,
		isLow : buildMembershipFunction(0, 0, 10, 45).getAt(body_input.value),
		isMed : buildMembershipFunction(10, 45, 55, 90).getAt(body_input.value),
		isHigh : buildMembershipFunction(55, 90, 100, 100).getAt(body_input.value)
	}
	
	acidity =
	{
		value : acidity_input.value,
		isLow : buildMembershipFunction(0, 0, 10, 45).getAt(acidity_input.value),
		isMed : buildMembershipFunction(10, 45, 55, 90).getAt(acidity_input.value),
		isHigh : buildMembershipFunction(55, 90, 100, 100).getAt(acidity_input.value)
	}
	
	// The membership functions for Sweetness have a much more gradual change from LOW to MED, and a sharp change from MED to HIGH.
	// The peak of MED is also shifted from center
	sweetness =
	{
		value : sweetness_input.value,
		isLow : buildMembershipFunction(0, 0, 5, 60).getAt(sweetness_input.value),
		isMed : buildMembershipFunction(5, 60, 70, 90).getAt(sweetness_input.value),
		isHigh : buildMembershipFunction(70, 90, 100, 100).getAt(sweetness_input.value)
	}
	
	// initialize the output variables
	// each has a "is___" function that works with the rule() function to keep track of which rules have triggered it
	// the weight of each set is stored in the "____weight" variables (ie, light_weight, etc)
	// since I am using scaling and center-of-mass, the weights are summed into a single value (two 0.5 weighted rules is equivilent to a single 1.0 weighted rule)
	// the defuzzification method is stored in the variable's "defuzz" function
	roast =
	{
		light_weight : 0,
		medium_weight : 0,
		dark_weight : 0,
		
		isLight : function (weight) { roast.light_weight += weight; },
		isMedium : function (weight) { roast.medium_weight += weight; },
		isDark : function (weight) { roast.dark_weight += weight; },
		
		defuzz : function () 
		{
			// defuzzify using center of mass
			var crisp = centerOfMass([
				{"fn": buildMembershipFunction(0, 0, 20, 40), "weight": roast.light_weight}, 
				{"fn": buildMembershipFunction(20, 40, 60, 80), "weight":roast. medium_weight}, 
				{"fn": buildMembershipFunction(60, 80, 100, 100), "weight": roast.dark_weight}
			]);
			
			// take highest membership of center of mass (re-fuzzify) 
			if(crisp <= 30) { return "light roast"; }
			else if(crisp < 70) { return "medium roast"; }
			else { return "dark roast"; }
		}
	}
	
	brew =
	{
		moka_weight : 0,
		french_weight : 0,
		aero_weight : 0,
		pour_weight : 0,
		
		isMoka : function (weight) { brew.moka_weight += weight; },
		isFrenchPress : function (weight) { brew.french_weight += weight; },
		isAeropress : function (weight) { brew.aero_weight += weight; },
		isPourOver : function (weight) { brew.pour_weight += weight; },
		
		defuzz : function () 
		{
			// defuzzify using center of mass
			var crisp = centerOfMass([
				{"fn": buildMembershipFunction(0, 0, 20, 30), "weight": brew.moka_weight}, 
				{"fn": buildMembershipFunction(15, 30, 45, 55), "weight":brew. french_weight}, 
				{"fn": buildMembershipFunction(45, 55, 70, 80), "weight": brew.aero_weight},
				{"fn": buildMembershipFunction(70, 80, 100, 100), "weight": brew.pour_weight}
			]);
			
			// take highest membership of center of mass (re-fuzzify) 
			if(crisp < 25) { return "a Moka Pot"; }
			else if(crisp < 50) { return "a French Press"; }
			else if(crisp < 75) { return "an Aeropress"; }
			else { return "a Pour-Over"; }
		}
	}
	
	sugar =
	{
		low_weight : 0,
		med_weight : 0,
		high_weight : 0,
		
		isLow : function (weight) { sugar.low_weight += weight; },
		isMed : function (weight) { sugar.med_weight += weight; },
		isHigh : function (weight) { sugar.high_weight += weight; },
		
		defuzz : function () 
		{
			// defuzzify using center of mass
			var crisp = centerOfMass([
				{"fn": buildMembershipFunction(0, 0, 20, 40), "weight": sugar.low_weight}, 
				{"fn": buildMembershipFunction(20, 40, 60, 80), "weight":sugar.med_weight}, 
				{"fn": buildMembershipFunction(60, 80, 100, 100), "weight": sugar.high_weight}
			]);
			
			// convert crisp value into words
			if(crisp < 30) { return "no sugar"; }
			else if(crisp < 40) { return "a pinch of sugar"; }
			else if(crisp < 50) { return "1 teaspoon of sugar"; }
			else if(crisp < 55) { return "1&frac14; teaspoons of sugar"; }
			else if(crisp < 70) { return "1&frac12; teaspoons of sugar"; }
			else if(crisp < 85) { return "1&frac34; teaspoons of sugar"; }
			else { return "2 teaspoons of sugar"; }
		}
	}
	
	
	// run the fuzzy rules
	// format: rule(CONDITIONAL, CONSEQUENT), repersenting: IF CONDITIONAL, THEN CONSEQUENT
	// for refrence, the rules are listed in order of how they appear in the term paper
	rule(sweetness.isHigh, sugar.isHigh);
	rule(sweetness.isMed, sugar.isMed);
	rule(sweetness.isLow, sugar.isLow);
	rule(and(caffeine.isHigh, not(sweetness.isLow)), sugar.isHigh);
	rule(and(caffeine.isHigh, sweetness.isLow), sugar.isMed);
	
	rule(acidity.isHigh, roast.isLight);
	rule(acidity.isLow, roast.isDark);
	rule(and(caffeine.isHigh, not(body.isHigh)), roast.isLight);
	rule(or(body.isHigh, caffeine.isLow), roast.isDark);
	
	rule(caffeine.isHigh, brew.isMoka);
	rule(and(caffeine.isLow, not(acidity.isLow)), brew.isPourOver);
	rule(and(body.isHigh, acidity.isLow), brew.isFrenchPress);
	rule(and(acidity.isHigh, body.isLow), brew.isPourOver);
	rule(and(acidity.isLow, body.isLow), brew.isAeropress);
	
	// update the results
	roast_output.innerHTML = roast.defuzz();
	brew_output.innerHTML = brew.defuzz();
	sugar_output.innerHTML = sugar.defuzz();
}