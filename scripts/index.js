function getAllPosts() {
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
            let output = "";
            for (const { post, comments } of postsWithComments) {
                output += `
                    <div class="post__main border border-2 border-secondary rounded my-3 p-3">
                        <p class="post__title text-bg-primary p-3">${post.title}</p>
                        <p class="post__content">${post.body}</p>
                        <div class="post__tags">Tags: ${post.tags}</div>
                        <div class="post__reactions d-flex flex-row">
                            <button type="button" class="btn btn-outline-danger btn-sm d-flex flex-row align-items-center">
                                <i class="bi bi-heart pe-1"></i><p class="fs-6 mb-0">${post.reactions}</p>
                            </button>
                            <button type="button" class="btn btn-outline-danger btn-sm d-flex flex-row align-items-center">
                                <i class="bi bi-chat"></i>
                            </button>
                        </div>
                        <div>
                            <ul>
                                ${comments.map(comment => `<li>${comment.body}</li>`).join('')}
                            </ul>
                        </div>
                    </div>`;
            }

            document.querySelector(".post").innerHTML = output;
        })
        
}

getAllPosts();