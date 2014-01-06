quokka.js
=========

Quokka - A simple canvas chart maker in JavaScript.



Pie charts:
###########
![pie chart](https://github.com/Humbedooh/quokka.js/raw/master/quokka_example2.png "Example pie chart")

To make a pie chart, use:
   `quokkaCircle(canvasName, [ value1, value2, ... ])`
Where `canvasName` is the name of the HTML5 canvas to draw on, and `value` is a hash consisting of a `title` and a `value`.

For example:

    quokkaCircle(
        "myCanvasID", 
        [ 
            {title: 'good eggs', value: 40},
            {title: 'bad eggs', value: 60}
         ]
      );
    
Line charts:
############
![line chart](https://github.com/Humbedooh/quokka.js/raw/master/quokka_example1.png "Example line chart")

To make a line chart, use:
   `quokkaLines(canvasName, [title1, title2, title3, ...], [ dataSet1, dataSet2, ... ], options)`

* canvasName: The name of the HTML5 canvas to draw on
* title1, title2, ...: The names of the lines to draw
* dataSet1, dataSet2, ...: Arrays containing the line values for each step
* options: A hash with one or more options, such as:
  * title: Optional title of the chart
  * stack: Whether to stack lines and color in the area between them
  * curve: Whether or not to use curved lines
  * nox: (no x) Whether to include X axis tags or not.

For example:

    quokkaLines("myCanvas", 
        ['Line a', 'Line b', 'Line c'], 
        [ 
            [new Date(), a1, b1, c1], 
            [new Date(), a2, b2, c2], 
            [new Date(), a3, b3, c3] 
        ],
        { stacked: true, curve: false, title: "Some title", nox: false }
      );



Bar charts:
############
![bar chart](https://github.com/Humbedooh/quokka.js/raw/master/quokka_example3.png "Example bar chart")

To make a bar chart, use the same structure as with line charts:
   `quokkaBars(canvasName, [title1, title2, title3, ...], [ dataSet1, dataSet2, ... ], options)`

* canvasName: The name of the HTML5 canvas to draw on
* title1, title2, ...: The names of the lines to draw
* dataSet1, dataSet2, ...: Arrays containing the line values for each step
* options: A hash with one or more options, such as:
  * title: Optional title of the chart
  * stack: Whether to stack lines and color in the area between them
  * nox: (no x) Whether to include X axis tags or not.

For example:

    quokkaBars("myCanvas", 
        ['Bar a', 'Bar b', 'Bar c'], 
        [ 
            [new Date(), a1, b1, c1], 
            [new Date(), a2, b2, c2], 
            [new Date(), a3, b3, c3] 
        ],
        { stacked: true, title: "Some title", nox: false }
      );

