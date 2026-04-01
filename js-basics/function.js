/** print 1 to 100**/
function printNumberOneToHundred(){
 for(let i=0;i<=100;i++){
    console.log(i);
 }
}
console.log("Numbers from 0 to 100:");
printNumberOneToHundred();

/**.  convert celsiusToFahrenheit ****/
/**
 * 
 * @param {*} celsius 
 * @returns fahrenheit
 */
function getCelsiusToFahrenheit(celsius){
 let fahrenheit=(celsius*1.8)+32;
 return fahrenheit;
}
console.log("Fahrenheit : "+getCelsiusToFahrenheit(20));

/** calculate average */
/**
 * 
 * @param {*} array 
 * @returns average
 */
function getAverage(array){
   let total=array.reduce((total,number)=>(total+number),0);
   return total/array.length;

}
console.log("Average : "+getAverage([1,2,3,4]));

/**reverse string */
/**
 * 
 * @param {*} word 
 * @returns reversedstring
 */
function getReversedString(word){
return word.split("").reverse().join("");
}
console.log("Reversed string : "+getReversedString("Madhumitha"));

/**print today date in dd/mm/yyyy format */
function printDate(){
    const today=new Date();
    const date=String(today.getDate()).padStart(2,'0');
    const month=String(today.getMonth()).padStart(2,'0');
    const year=today.getFullYear();
    return`${date}/${month}/${year}`;
}
console.log("Date : "+printDate());

