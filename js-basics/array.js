let teamMembers=["madhu","mitha","subha","hari","raja","geetha","prabha","siva","gokul","rani","chitra"];
console.log("old team : "+teamMembers);

/**remove first person */
teamMembers.shift();
console.log("new team : "+teamMembers);
console.log(teamMembers);
console.log(teamMembers.length);

/**add new person at the end */
teamMembers.push("abi");
console.log("Team : "+teamMembers);

/** sort the team in alphabetical order */
let sortedTeamMembers=teamMembers.sort();
console.log("Sorted team : "+sortedTeamMembers); 

/** generate random number */
teamMembers.forEach((teamMember)=>{
    let jerseyNumber=Math.floor(Math.random()*100)+1
    console.log(`${teamMember}-${jerseyNumber}`);
})

/**create team name uppercase list for jersey */
let teamMemberUppercaseNames=teamMembers.map((teamMember)=>teamMember.toUpperCase());
console.log(teamMemberUppercaseNames);