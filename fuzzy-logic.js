/*

           STANDARD TRAPEZOIDAL MEMBERSHIP
       +
M    1 |              XXXXXXXXXX
E      |             X          X
M      |            X +        + X
B      |           X  |        |  X
E      |          X   |        |   X
R   .5 |         X    |        |    X
S      |        X     |        |     X
H      |       X      |        |      X
I      |      X       |        |       X
P      |     X        |        |        X
     0 +--------------------------------------+
           start      +        +       end
               peak_start     peak_end

                    VALUE OF INPUT


             MAX/MIN TRAPEZOIDAL MEMBERSHIP
       +
M    1 |              XXXXXXXXXXXXX
E      |             X            X
M      |            X +           X
B      |           X  |           X
E      |          X   |           X
R   .5 |         X    |           X
S      |        X     |           X
H      |       X      |           X
I      |      X       |           X
P      |     X        |           X
     0 +--------------------------------------+
           start      +          end
               peak_start        peak_end

                    VALUE OF INPUT


                TRIANGULAR MEMBERSHIP
       +
M    1 |                   X
E      |                  X X
M      |                 X + X
B      |                X  |  X
E      |               X   |   X
R   .5 |              X    |    X
S      |             X     |     X
H      |            X      |      X
I      |           X       |       X
P      |          X        |        X
     0 +-------------------+------------------+
                start  peak_start  end
                        peak_end

                    VALUE OF INPUT


*/
function buildMembershipFunction(start, peak_start, peak_end, end)
{
	var membership_function =
	{
		getAt: function (input)
		{
			if(input < start) // input is lower than where trapazoid begins
			{
				return 0;
			}
			else if(input == peak_start) // input is right on the start of the peak (avoids divide-by-zero error in next if)
			{
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
	
	if(total_membership == 0)
	{
		return 0;
	}
	else
	{
		return total_mass / total_membership;
	}
}

function and(p, q)
{
	return Math.min(p, q);
}

function or(p, q)
{
	
	console.log(Math.max(p, q));
	return Math.max(p, q);
}

function not(p)
{
	return 1 - p;
}

