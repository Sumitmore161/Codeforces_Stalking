const DOM = {
    card: document.querySelector(".card"),
    maxrating: document.querySelector(".maxrating"),
    rating: document.querySelector(".rating"),
    image: document.querySelector(".image"),
    rank: document.querySelector(".rank"),
    maxRank: document.querySelector(".maxRank"),
    myBtn: document.getElementById("myBtn"),
    handle_name: document.getElementById("handle_name"),
    contest_rating: document.getElementById("contest_rating"),
    rating_content: document.querySelector(".rating_content"),
    container : document.querySelector(".container"),
    title : document.querySelector(".title")
}
const resource = {
    User_Url: "https://codeforces.com/api/user.info?handles=",
    contest_rating:"https://codeforces.com/api/user.rating?handle=",
    default_image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRelQ-AgS2qILX_nxmAb4hC-BUK8N0ArHUKTQ&ss"
}
let Contest;
// DOM.image.style.backgroundImage = `url(${resource.default_image})`;
DOM.myBtn.addEventListener("click", get_handle_data);
function get_handle_data() {
    resource.req_url = `${resource.User_Url}${DOM.handle_name.value}`;
    console.log(resource.req_url);
    new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", resource.req_url, true);
        xhr.onreadystatechange = function sexy() {
            if (xhr.readyState == 4) {
                const data = JSON.parse(this.responseText);
                if (data.status == "FAILED") {
                    reject("Error : User not Found");
                }
                else {
                    resolve(data["result"][0]);
                }
            }
        }
        xhr.send();
    }).then((obj) => {
        DOM.rating_content.innerHTML = "";
        DOM.title.innerHTML = DOM.handle_name.value;
        const x = String(obj.maxRank);
        DOM.card.style.backgroundColor = "red"
        setTimeout(()=>{
            DOM.card.style.backgroundColor = "";
        },100);
        DOM.maxRank.innerHTML = `max Rank : ${x}`;
        DOM.maxrating.innerHTML = `maxRating : ${obj.maxRating}`;
        DOM.image.style.backgroundImage = `url(${obj.titlePhoto})`;
        DOM.rating.innerHTML = `Current Rating : ${obj.rating}`;
        DOM.rank.innerHTML = `Current Rank : ${obj.rank}`;
        // return Promise.resolve(Contest);/
    }).then(()=>{
        Contest = `${resource.contest_rating}${DOM.handle_name.value}`;
        DOM.contest_rating.addEventListener("click",hot);
        function hot()
        {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", Contest, true);
            xhr.onreadystatechange = function ()
            {
                if(xhr.readyState == 4)
                {
                    const obj = JSON.parse(this.responseText);
                    return Promise.resolve(obj.result).then((obj)=>{
                        console.log(obj);
                        let sz = Object.keys(obj).length;
                        console.log(sz);
                        let itr = 10;
                        while(sz-- && itr--)
                        {
                            const tuple = {};
                              tuple.contestName = obj[sz].contestName;
                              tuple.rank = obj[sz].rank;
                              tuple.oldRating = obj[sz].oldRating;
                              tuple.newRating = obj[sz].newRating;

                              DOM.rating_content.innerHTML += `<div class="container"> 
                                                                    <div class ="content">${tuple.contestName}</div>
                                                                    <div class ="content">${tuple.rank}</div>
                                                                    <div class ="content">${tuple.oldRating} => ${tuple.newRating}</div>
                                                                </div>
                                                            `;
                        }
                    });
                }
            }
            xhr.send();
        }
    })
    .catch((data) => {
        alert(data);

    }).finally(() => {
        // console.log("done");
        DOM.handle_name.value = "";
    })
}
