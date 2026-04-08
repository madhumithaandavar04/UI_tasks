async function getFriends() {
    try {
        const response = await fetch("friends.json");
        if (!response.ok) {
            throw new Error("Could not fetch resources");
        }
        const friends = await response.json();
        return friends;
    } catch (error) {
        console.log(error);
    }
}
getFriends();

async function renderFriendCards() {
    const friendsContainer = document.getElementById("friendsContainer");
    const friends = await getFriends();
    for (const friend of friends) {
        const friendCard = document.createElement('article');
        friendCard.innerHTML = `<div class="contact-card" id="friendCard">
                <div class="friend-image">
                    <img id="friendImage" src=${friend.img} alt=${friend.name}>
                </div>
                <div class="friend-details">
                    <h2 id="friendName" class="friend-name">${friend.first_name + " " + friend.last_name}</h2>
                    <p id="friendEmail" class="friend-email">${friend.email}</p>
                </div>
            </div>`;
        friendsContainer.appendChild(friendCard);
    }
}
renderFriendCards();
