/*
	This is a library of general-use fuzzy logic functions, used by initializer.js
	
	Author: Jack Guinane
	Last updated: 2019-06-18
*/


/*
	Builds a membership-function object that has function getAt(x), which returns the truth value at x.
	Each membership function is defined by 4 points:
	start - the start of the shape (zero truth before start)
	peak_start - the point at which the shape reaches 1.0
	peak_end - the end of the peak (no longer 1.0)
	end - the end of the shape (zero from then on)

	Some visual examples of how membership functions can be built:

           STANDARD TRAPEZOIDAL MEMBERSHIP	                 MAX/MIN TRAPEZOIDAL MEMBERSHIP			  	       TRIANGULAR MEMBERSHIP
       +			        					      +											      +
M    1 |              XXXXXXXXXX				    1 |              XXXXXXXXXXXXX				    1 |                   X
E      |             X          X 				      |             X            X				      |                  X X
M      |            X +        + X				      |            X +           X				      |                 X + X
B      |           X  |        |  X				      |           X  |           X				      |                X  |  X
E      |          X   |        |   X			      |          X   |           X				      |               X   |   X	
R   .5 |         X    |        |    X			   .5 |         X    |           X				   .5 |              X    |    X
S      |        X     |        |     X			      |        X     |           X				      |             X     |     X	
H      |       X      |        |      X			      |       X      |           X				      |            X      |      X
I      |      X       |        |       X		      |      X       |           X				      |           X       |       X	
P      |     X        |        |        X		      |     X        |           X				      |          X        |        X
     0 +--------------------------------------+	    0 +--------------------------------------+	    0 +-------------------+------------------+
           start      +        +       end				  start      +          end					    	  start  peak_start  end
               peak_start     peak_end				    	peak_start        peak_end							      peak_end

                    VALUE OF INPUT								    VALUE OF INPUT							       VALUE OF INPUT
*/
function buildMembershipFunction(start, peak_start, peak_end, end)
{
	var membership_function =
	{
		// returns the truth value of the membership function at the input
		getAt: function (input)
		{
			if(input < start) // input is lower than where trapazoid begins
			{
				return 0;
			}
			else if(input == peak_start) // input is right on the start of the peak 
			{							// (occurs first to avoid divide-by-zero error in next if)
				return 1;
			}
			else if(input < peak_start) // input is between the start and the peak
			{
				return (input - start) / (peak_start - start)
			}
			else if(input <= peak_end) // input is on the peak
			{
				return 1;
			}
			else if(input < end) // input is between the end of the peak and the end
			{
				return 1 - ((input - peak_end) / (end - peak_end))
			}
			else // input is higher than the end of the shape
			{
				return 0;
			}
		}
	}
	return membership_function;
}

/*
	Adds the truth value of the conditional to the weighting of the consequent
	In the form of: IF {conditional}, THEN {consequent}
*/
function rule(conditional, consequent)
{
	consequent(conditional);
}

/*
	Finds and returns the center of mass by finding the mass at every 10-point increment
	This equation is defined on page 334 of "Fuzzy Logic – Controls, Concepts, Theories and Applications"
	See: https://www.intechopen.com/books/fuzzy-logic-controls-concepts-theories-and-applications/a-mamdani-type-fuzzy-logic-controller
	
	Takes in a list of dictionaries, where each dictionary contains a membership function ("fn") 
	and the weight that membership has been triggered ("weight")
*/
function centerOfMass(set)
{
	var total_mass = 0;
	var total_membership = 0;
	
	for(var i = 0; i <= 100; i += 10)
	{
		for(var j = 0; j < set.length; j += 1)
		{
			total_mass += i * set[j]["fn"].getAt(i) * set[j]["weight"]; // the value at i * the membership at i * the weight of that set
			total_membership += set[j]["fn"].getAt(i) * set[j]["weight"];
		}
	}
	
	if(total_membership == 0) // avoid divide-by-zero
	{
		return 0;
	}
	
	return total_mass / total_membership;
}

/*
	Probablistic T-Norm
	Returns the truth value of "p AND q"
*/
function and(p, q)
{
	return p * q;
}

/*
	Probablistic S-Norm
	Returns the truth value of "p OR q"
*/
function or(p, q)
{
	return (p + q) - (p * q);
}

/*
	Natural Negation
	Returns the truth value of "NOT p"
*/
function not(p)
{
	return 1 - p;
}
