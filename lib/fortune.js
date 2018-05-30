var fortuneCookies = [
    "Conquer your fears",
    "Be the river",
    "Have no fear",
    "Hail Satan",
    "Its the economy stupid"
];

exports.getFortune = function(){
    var idx = Math.floor(Math.random()*fortuneCookies.length);
    return fortuneCookies[idx];
}