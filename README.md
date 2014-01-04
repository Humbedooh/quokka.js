quokka.js
=========

Quokka - A simple canvas chart maker in JavaScript.



Pie charts:
###########

To make a pie chart, use:
   `quikkaCircle(canvasName, [ value1, value2, ... ])`
Where `canvasName` is the name of the HTML5 canvas to draw on, and `value` is a hash consisting of a `title` and a `value`.

For example:

    quokkaCircle("myCanvasID", [ {title: 'good eggs', value: 40}, {title: 'bad eggs', value: 60} ] );
    
Line charts:
############

To make a line chart, use:
   `quikkaLines(canvasName, [title1, title2, title3, ...], [ dataSet1, dataSet2, ... ], options)`

* canvasName: The name of the HTML5 canvas to draw on
* title1, title2, ...: The names of the lines to draw
* dataSet1, dataSet2, ...: Arrays containing the line values for each step
* options: A hash with one or more options, such as:
  * title: Optional title of the chart
  * stack: Whether to stack lines and color in the area between them
  * curve: Whether or not to use curved lines

For example:

    quokkaLines("myCanvas", 
        ['Line a', 'Line b', 'Line c'], 
        [ 
            [a1,b1,c1], 
            [a2,b2,c2], 
            [a3,b3,c3] 
        ],
        { stacked: true, curve: false, title: "Some title" }
      );

