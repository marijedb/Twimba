// COMING FEATURES: 
// reply to a specific tweet
// save tweets, likes and retweets to local storage
// like, comment or retweet a comment


import {tweetsData} from './data.js'
import {v4 as uuidv4} from 'https://jspm.dev/uuid';

// Add event listeners towards all clickable objects on the page and add in event as parameter
document.addEventListener('click', function (e) {
    //e.target.datasets are set to the uuid linked to the clickable Object. 
    // so passing in e.target.dataset.like will return the uuid of that object. 

    // Checks if clicked object has the dataset of like added to it. 
    if (e.target.dataset.like) {
        handleLikeClick(e.target.dataset.like)
    }
    // Checks if clicked object has the dataset of retweet added to it. 
    else if (e.target.dataset.retweet) {
        handleRetweetClick(e.target.dataset.retweet)
    }
    // Checks if clicked object has the dataset of reply added to it. 
    else if (e.target.dataset.reply) {
        handleReplyClick(e.target.dataset.reply)
    }
    // checks if clicked object's ID is equal to "tweet-btn"
    else if (e.target.id === 'tweet-btn') {
        handleTweetBtnClick()
    }
    else if (e.target.dataset.delete){
        handleDeleteClick(e.target.dataset.delete)
    }
})

// this function gets the uuid passed in as parameter from the object of which like button is clicked. 
function handleLikeClick(tweetId) {
    // this loops through all tweetsData objects and returns ONLY the
    // Object from who the UUID belongs to. 
    const targetTweetObj = tweetsData.filter(function (tweet) {
        return tweet.uuid === tweetId
    })[0]

    // If the tweet is already liked it will decrement the likes.
    if (targetTweetObj.isLiked) {
        targetTweetObj.likes--
    }
    // If its not liked yet it will increment the likes. 
    else {
        targetTweetObj.likes++
    }
    // Here it will switch the object from liked to unliked and vice versa. 
    // this will help with knowing if object is already liked or not on next click
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    // This function will exectute the render function which will render the updated info to page. 
    render()
}

// This function gets the uuid passed in as parameter from the object of which retweet button is clicked. 
function handleRetweetClick(tweetId) {
    // this loops through all tweetsData objects and returns ONLY the
    // Object from who the UUID belongs to. 
    const targetTweetObj = tweetsData.filter(function (tweet) {
        return tweet.uuid === tweetId
    })[0]

    // If the tweet is already retweeted it will decrement the retweets.
    if (targetTweetObj.isRetweeted) {
        targetTweetObj.retweets--
    }
    // If its not retweeted yet it will increment the retweets. 
    else {
        targetTweetObj.retweets++
    }
    // Here it will switch the object from retweeted to not retweeted and vice versa. 
    // this will help with knowing if object is already retweeted or not on next click
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    // This function will exectute the render function which will render the updated info to page. 
    render()
}

// This function gets the uuid passed in as parameter from the object of which reply button is clicked. 
function handleReplyClick(replyId) {
    // This will target the ID belonging to the comments section that is linked to the uuid
    // that is clicked and will toggle the hidden object, making it visible or hide it when clicked. 
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick() {
    // this will store the tweet input text area into a variable. 
    const tweetInput = document.getElementById('tweet-input')

    // If theres content inside the textarea it will run the following code:
    if (tweetInput.value) {
        // this will create a new object and push it to front of 
        // the tweetsdata array, making it appear on top. 
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            // this will generate a random UUID for the new tweet. 
            uuid: uuidv4(),
            deletable: true,
        })
        // This will render the new object to the page. 
        render()
        // This will empty out the textarea field for a new tweet again. 
        tweetInput.value = ''
    }

}

// This function gets the uuid passed in as parameter from the object of which delete button is clicked. 
function handleDeleteClick(deleteID){
    // First this will find the index of the object inside tweetsData array that needs to be deleted
    const indexOfObject = tweetsData.findIndex(function(tweet){
        return tweet.uuid === deleteID;
    })

    // this will delete the object from the array, passing in the index of its location
    tweetsData.splice(indexOfObject, 1)
    // This will render out the new page without deleted tweet. 
    render();

}

function getFeedHtml() {
    // the full feed will be set as empty string to start out with. 
    let feedHtml = ``

    // this will loop over the tweetsdata array and does something
    // with every object (tweet) that it passes. 
    tweetsData.forEach(function (tweet) {
        // this variable is created to change heart icon to red
        // by toggling class "liked" on and off. it's set to an empty string
        // by default cause it starts out as "unliked"
        let likeIconClass = ''

        // if in loop the isLiked key is set to true it will toggle on the "liked" 
        // class, making the heart like icon red. 
        if (tweet.isLiked) {
            likeIconClass = 'liked'
        }

        // this variable is created to change retweet icon to green
        // by toggling class "retweeted" on and off. it's set to an empty string
        // by default cause it starts out as "not retweeted"
        let retweetIconClass = ''

        // if in loop the isRetweeted key is set to true it will toggle on the "retweeted" 
        // class, making the retweeted icon green. 
        if (tweet.isRetweeted) {
            retweetIconClass = 'retweeted'
        }

        // This will initate the repliesHtml variable and set it to an empty string. 
        // it is used to render out the replies to tweets if there are any. 
        let repliesHtml = ''

        // if there are any replies inside the current looped tweet it will run this code block:
        if (tweet.replies.length > 0) {
            // for each reply inside the replies array in the object it will
            // create the html belonging to it with its current profile pic, handle and
            // tweetText. It will then add it to the repliesHtml variable. 
            tweet.replies.forEach(function (reply) {
                repliesHtml += `
                    <div class="tweet-reply">
                        <div class="tweet-inner">
                            <img src="${reply.profilePic}" class="profile-pic">
                                <div>
                                    <p class="handle">${reply.handle}</p>
                                    <p class="tweet-text">${reply.tweetText}</p>
                                </div>
                            </div>
                    </div>
                    `
            })
        }

        // Set deleteIcon to empty string for initializing
        let deleteIcon = "";

        // if deletable key is set to true this block of code will run:
        // (This string will only be added to feed on own posts)
        if(tweet.deletable){
            deleteIcon = `
            <span class="tweet-detail">
                <i class="fa-solid fa-trash-can" data-delete="${tweet.uuid}"></i>
            </span>`
        }

        // this is the main feed variable which will actually end up onto the page. 
        // with each loop it will add another tweet to the feedHtml variable 
        // Each loop it will go through the object and add all necessary keys
        // belonging to that object into the HTML. 
        feedHtml += `
            <div class="tweet">
                <div class="tweet-inner">
                    <img src="${tweet.profilePic}" class="profile-pic"> 
                    <div>
                        <p class="handle">${tweet.handle}</p>
                        <p class="tweet-text">${tweet.tweetText}</p>
                        <div class="tweet-details">
                            <span class="tweet-detail">
                                <i class="fa-regular fa-comment-dots"
                                data-reply="${tweet.uuid}"
                                ></i>
                                ${tweet.replies.length}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-heart ${likeIconClass}"
                                data-like="${tweet.uuid}"
                                ></i>
                                ${tweet.likes}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-retweet ${retweetIconClass}"
                                data-retweet="${tweet.uuid}"
                                ></i>
                                ${tweet.retweets}
                            </span>
                            ${deleteIcon}
                        </div>   
                    </div>            
                </div>
                <div class="hidden" id="replies-${tweet.uuid}">
                    ${repliesHtml}
                </div>   
            </div>
            `
    })
    return feedHtml
}

function render() {
    // This will grab the full feed div and changes its inner html
    // to whats been rendered inside the getFeedHtml function. 
    document.getElementById('feed').innerHTML = getFeedHtml()
}

// this will render the page as soon as page is loaded at first load. 
render()