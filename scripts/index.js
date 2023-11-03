


function getAllPosts() {
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
            let output = "";
            for (const { post, comments } of postsWithComments) {

                output += `
                    <div class="post__main border my-3 p-3">
                        <p class="post__title text-bg-primary p-3">${post.title}</p>
                        <p class="post__content">${post.body}</p>
                        <div class="post__tags">Tags: ${post.tags}</div>
                        <div class="post__reactions d-flex flex-row justify-content-between align-items-center border" style="width: 8%">
                            
                                <i class="heartBtn bi bi-heart d-flex flex-row justify-content-between align-items-center" style="color: red"></i><p class="heartCount m-0 p-1">${post.reactions}</p>
                            
                           
                                <i class="commentBtn bi bi-chat d-flex flex-row justify-content-between align-items-center" ></i><p class="heartCount m-0 p-1">${comments.length}</p>
                          
                        </div>
                        <div class="commentsDiv container d-none">
                            <ul  class="list-group">
                                ${comments.map(comment => `<li class="list-group-item">${comment.body}</li>`).join('')}
                            </ul>
                        </div>
                    </div>`;
            }

            document.querySelector(".post").innerHTML = output;

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
                        } else {
                            currentReactions --;
                        }

                        heartCount.textContent = currentReactions;
            
                    })
                })

            }





    getAllPosts()

    
let newPost = "";

newPost += `
<form style="width: 50%">
    <div class="form-group">
        <input type="text" class="form-control" placeholder="Enter title" required>
    </div>
    <div class="form-group">
        <textarea type="text" class="form-control" placeholder="Enter text" rows="3" required></textarea>
    </div>
    <div class="form-group">
        <input type="text" class="form-control" placeholder="Enter tags" required>
    </div>
    <button type="submit" class="btn btn-primary">Publish</button>
</div>
</form>`;

document.querySelector(".create-post").innerHTML = newPost;