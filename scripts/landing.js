var animatePoints = function() {
 
                 var points = document.getElementsByClassName('point');
    
                 var revealPoint = function(indNum) {
                     points[indNum].style.opacity = 1;
                     points[indNum].style.transform = "scaleX(1) translateY(0)";
                     points[indNum].style.msTransform = "scaleX(1) translateY(0)";
                     points[indNum].style.WebkitTransform = "scaleX(1) translateY(0)";  
                 };
 
                 for (var i = 0; i<points.length; i++) {
                     revealPoint(i);
                 }
 
             };