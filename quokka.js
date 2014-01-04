/*
 * Copyright 2014 Daniel Gruno et al.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Hue, Saturation and Lightness to Red, Green and Blue:
function quokka_internal_hsl2rgb (h,s,l)
{
    var min, sv, switcher, fract, vsf;
    h = h % 1;
    if (s > 1) s = 1;
    if (l > 1) l = 1;
    var v = (l <= 0.5) ? (l * (1 + s)) : (l + s - l * s);
    if (v === 0)
        return { r: 0, g: 0, b: 0 };

    min = 2 * l - v;
    sv = (v - min) / v;
    var sh = (6 * h) % 6;
    switcher = Math.floor(sh);
    fract = sh - switcher;
    vsf = v * sv * fract;

    switch (switcher)
    {
        case 0: return { r: v, g: min + vsf, b: min };
        case 1: return { r: v - vsf, g: v, b: min };
        case 2: return { r: min, g: v, b: min + vsf };
        case 3: return { r: min, g: v - vsf, b: v };
        case 4: return { r: min + vsf, g: min, b: v };
        case 5: return { r: v, g: min, b: v - vsf };
    }
    return {r:0, g:0, b: 0};
}

// RGB to Hex conversion
function quokka_internal_rgb2hex(r, g, b) {
    return "#" + ((1 << 24) + (Math.floor(r) << 16) + (Math.floor(g) << 8) + Math.floor(b)).toString(16).slice(1);
}


// Generate color list used for charts
var colors = [];
var numColorRows = 3;
var numColorColumns = 10;
for (var x=0;x<numColorRows;x++) {
    for (var y=0;y<numColorColumns;y++) {
        var color = quokka_internal_hsl2rgb((0.6+((y*100)%256)/256) % 1.00001, 0.75, 0.52 + (0.48*(x/numColorRows)));
        
        // Light (primary) color:
        var hex = quokka_internal_rgb2hex(color.r*255, color.g*255, color.b*255);
        
        // Darker variant for gradients:
        var dhex = quokka_internal_rgb2hex(color.r*111, color.g*111, color.b*111);
        
        colors.push([hex, dhex]);
    }
}


/* Function for drawing pie diagrams
 * Example usage:
 * quokkaCircle("canvasName", [ { title: 'ups', value: 30}, { title: 'downs', value: 70} ] );
 */

function quokkaCircle(id, tags, opts) {
    // Get Canvas object and context
    var canvas = document.getElementById(id);
    var ctx=canvas.getContext("2d");
    
    // Calculate the total value of the pie
    var total = 0;
    var k;
    for (k in tags) {
        tags[k].value = Math.abs(tags[k].value);
        total += tags[k].value;
    }
    
    // Draw the empty pie
    var begin = 0;
    var stop = 0;
    var radius = (canvas.height*0.75)/2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 0.5;
    ctx.shadowOffsetY = 0.6;
    ctx.shadowColor = "#666";
    ctx.beginPath();
    ctx.arc((canvas.width-140)/2,canvas.height/2,radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    var posY = 20;
    for (k in tags) {
        var val = tags[k].value;
        stop = stop + (2 * Math.PI * (val / total));
        
        // Make a pizza slice
        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.arc((canvas.width-140)/2,canvas.height/2,radius,begin,stop);
        ctx.lineTo((canvas.width-140)/2,canvas.height/2);
        ctx.closePath();
        ctx.lineWidth = 0;
        ctx.stroke();
        
        // Add color gradient
        var grd=ctx.createLinearGradient(0,0,170,0);
        grd.addColorStop(0,colors[k % colors.length][1]);
        grd.addColorStop(1,colors[k % colors.length][0]);
        ctx.fillStyle = grd
        ctx.fill();
        begin = stop;
        
        // Make color legend
        ctx.fillRect(220, posY-10, 10, 10);
        
        // Add legend text
        ctx.font="12px Arial";
        ctx.fillStyle = "#000";
        ctx.fillText(tags[k].title + " (" + Math.floor(val) + ")",240,posY);
        
        posY += 20;
    }
}


/* Function for drawing line charts
 * Example usage:
 * quokkaLines("myCanvas", ['Line a', 'Line b', 'Line c'], [ [a1,b1,c1], [a2,b2,c2], [a3,b3,c3] ], { stacked: true, curve: false, title: "Some title" } );
 */
function quokkaLines(id, titles, values, options) {
    var canvas = document.getElementById(id);
    var ctx=canvas.getContext("2d");
    var lwidth = 150;
    var stack = options ? options.stack : false;
    var curve = options ? options.curve : false;
    var title = options ? options.title : null;
    // Draw a border
    ctx.lineWidth = 0.5;
    ctx.strokeRect(10, 30, canvas.width - lwidth, canvas.height - 40);
    
    // Draw a title if set:
    if (title != null) {
        ctx.font="15px Arial";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.fillText(title,(canvas.width-lwidth)/2, 15);
    }
    
    // Draw legend
    ctx.textAlign = "left";
    var posY = 50;
    for (k in titles) {
        var title = titles[k] + " (" + values[values.length-1][k] + ")";
        ctx.fillStyle = colors[k % colors.length][0];
        ctx.fillRect(canvas.width - lwidth + 20, posY-10, 10, 10);
        
        // Add legend text
        ctx.font="12px Arial";
        ctx.fillStyle = "#000";
        ctx.fillText(title,canvas.width - lwidth + 40, posY);
        
        posY += 15;
    }
    
    // Find max and min
    var max = null;
    var min = null;
    var stacked = null;
    for (x in values) {
        var s = 0;
        for (y in values[x]) {
            s += values[x][y];
            if (max == null || max < values[x][y]) {
                max = values[x][y];
            }
            if (min == null || min > values[x][y]) {
                min = values[x][y];
            }
        }
        if (stacked == null || stacked < s) {
            stacked = s;
        }
    }
    if (stack) {
        min = 0;
        max = stacked;
    }
    
    
    // Set number of lines to draw and each step
    var numLines = 5;
    var step = (max-min) / (numLines+1);
    
    // Prettify the max value so steps aren't ugly numbers
    if (step %1 != 0) {
        step = (Math.round(step+0.5));
        max = step * (numLines+1);
    }
    
    // Draw horizontal lines
    for (x = 0; x <= numLines; x++) {
        
        var y = 30 + (((canvas.height-40) / (numLines+1)) * (x+1));
        ctx.moveTo(10, y);
        ctx.lineTo(canvas.width - lwidth + 10, y);
        ctx.lineWidth = 0.25;
        ctx.stroke();
        
        // Add values
        ctx.font="10px Arial";
        ctx.fillStyle = "#000";
        ctx.textAlign = "right";
        ctx.fillText( Math.round( ((max-min) - (step*(x+1))) * 100 ) / 100,canvas.width - lwidth, y-4);
        ctx.fillText( Math.round( ((max-min) - (step*(x+1))) * 100 ) / 100,35, y-4);
    }
    
    
    // Draw vertical lines
    ctx.beginPath();
    var numLines = values.length-1;
    for (x = 0; x < numLines; x++) {
        var y = 10 + (((canvas.width-lwidth - 10) / (numLines+1)) * (x+1));
        ctx.moveTo(y, 30);
        ctx.lineTo(y, canvas.height - 10);
        ctx.lineWidth = 0.25;
        ctx.stroke();
    }
    
    
    
    // Draw each line
    stacks = [];
    pstacks = []
    for (k in values) { stacks[k] = 0; pstacks[k] = canvas.height - 40; }
    for (k in titles) {
        
        ctx.beginPath();
        var color = colors[k % colors.length][0];
        var value = values[0][k];
        var step = ( canvas.width - lwidth) / (numLines+1);
        var x = 10 + (step/2);
        var y = (canvas.height - 10) - (((value-min) / (max-min)) * (canvas.height - 40));
        var py = y;
        if (stack) {
            y -= stacks[0];
            pstacks[0] = stacks[0];
            stacks[0] += (((value-min) / (max-min)) * (canvas.height - 40));
        }
        
        // Draw line
        ctx.moveTo(x, y);
        var pvalY = y;
        var pvalX = x;
        for (i in values) {
            if (i > 0) {
                x = 10 + (step/2) + (step*i);
                value = values[i][k];
                y = (canvas.height - 10) - (((value-min) / (max-min)) * (canvas.height - 40));
                if (stack) {
                    y -= stacks[i];
                    pstacks[i] = stacks[i];
                    stacks[i] += (((value-min) / (max-min)) * (canvas.height - 40));
                }
                // Draw curved lines??
                /* We'll do: (x1,y1)-----(x1.5,y1)
                 *                          |
                 *                       (x1.5,y2)-----(x2,y2)
                 * with a quadratic beizer thingy
                */
                if (curve) {
                    ctx.bezierCurveTo((pvalX + x) / 2, pvalY, (pvalX + x) / 2, y, x, y);
                    pvalX = x;
                    pvalY = y;
                }
                // Nope, just draw straight lines
                else {
                    ctx.lineTo(x, y);
                }
            }
        }
        
        ctx.lineWidth = 2;
        ctx.strokeStyle = color;
        ctx.stroke();
        
        
        
        // Draw stack area
        if (stack) {
            ctx.globalAlpha = 0.65;
            var lastPoint = canvas.height - 40;
            for (i in values) {
                if (i > 0) {
                    x = 10 + (step/2) + (step*i);
                    value = values[i][k];
                    y = (canvas.height - 10) - (((value-min) / (max-min)) * (canvas.height - 40));
                    y -= stacks[i];
                    lastPoint = pstacks[i];
                }
            }
            var pvalY = y;
            var pvalX = x;
            for (i in values) {
                l = values.length - i - 1;
                x = 10 + (step/2) + (step*l);
                y = canvas.height - 10 - pstacks[l];
                
                if (curve) {
                    ctx.bezierCurveTo((pvalX + x) / 2, pvalY, (pvalX + x) / 2, y, x, y);
                    pvalX = x;
                    pvalY = y;
                }
                else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.lineTo(10 + (step/2), py - pstacks[0]);
            ctx.lineWidth = 0;
            ctx.strokeStyle = colors[k % colors.length][0];
            ctx.fillStyle = colors[k % colors.length][0];
            ctx.fill();
        }

    }
}