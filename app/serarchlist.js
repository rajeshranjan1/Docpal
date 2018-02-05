angular.module('myApp', []).controller('searchCtrl', function($scope) {
    $scope.names = [
        {img:'Dr1.jpg',name:' Dr. Garima jain',education:"P.G diploma in 'Oral' implemelment & surgery",experiance:'10 years',clinicname:'Dr. Garima Jains Dental Care',address:'Lajpat Nagar, Delhi',timingdays:'MON-SAT', 
timinghours:'10:30 AM - 9:00 PM'},
        {img:'dr2.jpg',name:' Dr. Abhishek gupta',education:'Master in Oral implemelment & surgery',experiance:'12 years',address:'Saket, Delhi',timingdays:'MON-SAT', 
timinghours:'08:30 AM - 7:00 PM'},
        {img:'dr3.jpg',name:' Dr. Jani gupta',education:'M.B.B.S surgery',experiance:'15 years',address:'Malviya nazar, Delhi',timingdays:'MON-SAT', 
timinghours:'11:30 AM - 8:00 PM'}
    ];
});