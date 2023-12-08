let output = "";
let newPostContent = "";
let createdPost = "";
let postsData = [];

function getAllPosts() {
    // localStorage.clear()
    const storedData = localStorage.getItem('postsData');
    if (storedData) {
        const postsWithComments = JSON.parse(storedData);
        showPosts(postsWithComments);
    } else {
    fetch('https://dummyjson.com/posts')
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            if (data.posts && Array.isArray(data.posts)) {
                const postPromises = data.posts.map((post) => {
                    return fetch(`https://dummyjson.com/posts/${post.id}/comments`)
                        .then((com) => com.json())
                        .then((comments) => {
                            console.log(comments.comments)
                            const commentsArray = comments.comments;
                            return {
                                post: post,
                                comments: commentsArray
                            };
                        });
                });

                return Promise.all(postPromises);
            }
        })
        .then((postsWithComments) => {
            console.log(postsWithComments);
            localStorage.setItem('postsData', JSON.stringify(postsWithComments));

            showPosts(postsWithComments)
        }
        )}
    }

            function showPosts(postsWithComments) {
            


            for (const { post, comments } of postsWithComments) {
                
           

                output += `
                    <div class="post__main border rounded my-3 p-3">
                        <h3 class="post__title text-bg-primary p-3 border rounded">${post.title}</h3>
                        <p class="post__content">${post.body}</p>
                        <div class="post__tags">Tags: <span class="text-warning"> ${post.tags.join(" ")} </span></div>
                        <div class="post__reactions d-flex flex-row justify-content-between align-items-center mt-1" style="width: 8%">
                            
                                <i class="heartBtn bi bi-heart d-flex flex-row justify-content-between align-items-center" style="color: red"></i><p class="heartCount m-0 p-1">${post.reactions}</p>
                            
                           
                                <i class="commentBtn bi bi-chat d-flex flex-row justify-content-between align-items-center" ></i><p class="heartCount m-0 p-1">${comments.length}</p>
                          
                        </div>
                        <div class="commentsDiv container d-none w-100">
                            <ul  class="list-group">
                                ${comments.map(comment => `<li class="list-group-item mt-2">${comment.body}</li>`).join('')}
                            </ul>
                            <form class="comments">
                                <textarea class="form-control m-1" id="commentContent" placeholder="Enter your comment" rows="2" required></textarea>
                                <button type="submit" class="btn btn-primary m-1 addComment" disabled>Add Comment</button>
                            </form>
                        </div>
                    </div>`;
            }

            document.querySelector(".post").innerHTML = output;

            // add comments
                
            const addComment = document.querySelectorAll('.addComment');


            addComment.forEach(button => {
                const commentContentInput = button.parentElement.querySelector('#commentContent');
                commentContentInput.addEventListener('input', function() {
                    button.disabled = !commentContentInput.value.trim();
                });

                button.addEventListener('click', function(event) {
                    event.preventDefault();
                    
                    const commentContent = commentContentInput.value;
  


                     console.log('Add comment');
                     console.log(commentContent)

                     const parentDiv = this.closest('.post__main'); 
                     const commentList = parentDiv.querySelector('.list-group');
                     const newComment = document.createElement('li');
                     newComment.className = 'list-group-item mt-2';
                     newComment.textContent = commentContent;
                     commentList.appendChild(newComment);

                     button.disabled = true;

                     commentContentInput.value = "";

                });
            });

             // comments

             const commentButtons = document.querySelectorAll('.commentBtn');
             commentButtons.forEach(button => {
                 button.addEventListener('click', function() {
                     const parentDiv = this.closest('.post__main'); 
                     const commentsDiv = parentDiv.querySelector('.commentsDiv'); 
                     
                     commentsDiv.classList.toggle('d-none');

                      console.log('Comment button clicked!');
                 });
             });

             // likes

             const heartBtn = document.querySelectorAll('.heartBtn');
             

             
             heartBtn.forEach(button => {
                 button.addEventListener('click', function() {
                     button.classList.toggle('bi-heart-fill')
                     button.classList.toggle('bi-heart')
                     const parentDiv = this.closest('.post__main'); 
                     const heartCount = parentDiv.querySelector('.heartCount');

                     let currentReactions = parseInt(heartCount.textContent, 10);

                     if (button.classList.contains('bi-heart-fill')) {
                         currentReactions ++;
                         console.log(updatedStorage);
                         
                         
                         
                     } else {
                         currentReactions --;
                         
                     }

                     heartCount.textContent = currentReactions;
         
                 })
             })

            // FORM TO ADD NEW POST

            newPostContent += `
            <form>
                <div class="form-group">
                    <input type="text" class="form-control m-1" placeholder="Enter title" id="newTitle" required>
                </div>
                <div class="form-group">
                    <textarea type="text" class="form-control m-1" placeholder="Enter text" id="newText" rows="3" required></textarea>
                </div>
                <div class="form-group">
                    <input type="text" class="form-control m-1" placeholder="Enter tags" id="newTags" required>
                </div>
                <button type="submit" class="btn btn-primary m-1">Publish</button>
            </div>
            </form>`;

            document.querySelector(".create-post").innerHTML = newPostContent;
            const notPublished = document.querySelector(".create-post")


            notPublished.addEventListener('submit', function(event) {
                event.preventDefault();
            

                const newTitle = document.getElementById('newTitle').value;
                const newText = document.getElementById('newText').value;
                const newTags = document.getElementById('newTags').value;
                console.log(newTitle, newText, newTags)
                
                

                const newPost = {
                    post:{
                    title: newTitle,
                    body: newText,
                    tags: [newTags],
                    reactions: 0
                },
                    comments: []
                };

                const existingData = localStorage.getItem('postsData');
                

                if (existingData) {
                    postsData = JSON.parse(existingData);
                    
                }
            
                postsData.unshift(newPost)
                localStorage.setItem('postsData', JSON.stringify(postsData));
                console.log(postsData);
                console.log(newPost);
                console.log(localStorage.postsData)
                
                // ALL POSTS INCL NEWLY PUBLISHED

                for (const { post, comments } of  postsData) {
                    // console.log(post.title)
                    // console.log(post.body)
                    // console.log(post.tags)

                    createdPost += `
                    <div class="post__main border rounded my-3 p-3">
                    <h3 class="post__title text-bg-primary p-3 border rounded">${post.title}</h3>
                    <p class="post__content">${post.body}</p>
                    <div class="post__tags">Tags: <span class="text-warning"> ${post.tags.join(" ")} </span></div>
                    <div class="post__reactions d-flex flex-row justify-content-between align-items-center mt-1" style="width: 8%">
                        
                            <i class="heartBtn bi bi-heart d-flex flex-row justify-content-between align-items-center" style="color: red"></i><p class="heartCount m-0 p-1">${post.reactions}</p>
                       
                            <i class="commentBtn bi bi-chat d-flex flex-row justify-content-between align-items-center" ></i><p class="heartCount m-0 p-1">${comments.length}</p>
                      
                    </div>
                    <div class="commentsDiv container d-none">
                        <ul  class="list-group">
                            ${comments.map(comment => `<li class="list-group-item">${comment.body}</li>`).join('')}
                        </ul>
                        <div class="comments">
                                <textarea class="form-control m-1" id="commentContent" placeholder="Enter your comment" rows="2" required></textarea>
                                <button type="submit" class="btn btn-primary m-1 addComment" disabled>Add Comment</button>
                        </div>
                    </div>
                    
                </div>`;
                }
                document.querySelector(".post").innerHTML = output;  
                document.querySelector(".created-post").innerHTML = createdPost;

                document.getElementById('newTitle').value = "";
                document.getElementById('newText').value = "";
                document.getElementById('newTags').value = "";

                // add comments
                
                const addComment = document.querySelectorAll('.addComment');

                addComment.forEach(button => {
                button.addEventListener('click', function(event) {
                    event.preventDefault();
                    const commentContent = document.getElementById('commentContent').value;
                    

                     console.log('Add comment');
                     console.log(commentContent)

                     const parentDiv = this.closest('.post__main'); 
                     const commentList = parentDiv.querySelector('.list-group');
                     const newComment = document.createElement('li');
                     newComment.className = 'list-group-item mt-2';
                     newComment.textContent = commentContent;
                     commentList.appendChild(newComment);

                    document.getElementById('commentContent').value = "";

                });
            });
                
                // comments

             const commentButtons = document.querySelectorAll('.commentBtn');
             commentButtons.forEach(button => {
                 button.addEventListener('click', function() {
                     const parentDiv = this.closest('.post__main'); 
                     const commentsDiv = parentDiv.querySelector('.commentsDiv'); 
                     
                     commentsDiv.classList.toggle('d-none');

                      console.log('Comment button clicked!');
                 });
             });

             // likes

             const heartBtn = document.querySelectorAll('.heartBtn');
             

             
             heartBtn.forEach(button => {
                 button.addEventListener('click', function() {
                     button.classList.toggle('bi-heart-fill')
                     button.classList.toggle('bi-heart')
                     const parentDiv = this.closest('.post__main'); 
                     const heartCount = parentDiv.querySelector('.heartCount');

                     let currentReactions = parseInt(heartCount.textContent, 10);

                     if (button.classList.contains('bi-heart-fill')) {
                         currentReactions ++;
                         console.log(updatedStorage);
                         
                         
                         
                     } else {
                         currentReactions --;
                         
                     }

                     heartCount.textContent = currentReactions;
         
                 })
             })
            
        })
            
        let updatedStorage = localStorage.postsData;


}


            


    getAllPosts()

    

// TODO
// ? make tags in different color?
// add input for new comments
// if com = 0, user can add own commwnts
