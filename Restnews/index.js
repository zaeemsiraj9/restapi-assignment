document.getElementById('fetch-posts').addEventListener('click', fetchPosts);

function fetchPosts() {
    fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(posts => {
            return fetch('https://jsonplaceholder.typicode.com/users')
                .then(response => response.json())
                .then(users => {
                    return { posts, users };
                });
        })
        .then(({ posts, users }) => {
            const postsContainer = document.getElementById('posts-container');
            postsContainer.innerHTML = '';
            posts.forEach((post, index) => {
                const user = users.find(user => user.id === post.userId);
                const postElement = document.createElement('div');
                postElement.classList.add('post', `post-${index}`);
                postElement.innerHTML = `
                    <h2>${post.title}</h2>
                    <p>${post.body}</p>
                    <div class="user-info">Posted by: ${user.name} (${user.email})</div>
                    <button class="view-details" data-post-id="${post.id}">View Details</button>
                    <div class="post-details" id="post-details-${post.id}"></div>
                `;
                postsContainer.appendChild(postElement);
            });

            document.querySelectorAll('.view-details').forEach(button => {
                button.addEventListener('click', (event) => {
                    const postId = event.target.getAttribute('data-post-id');
                    const postDetailsContainer = document.getElementById(`post-details-${postId}`);
                    fetchPostDetails(postId, postDetailsContainer);
                });
            });
        })
        .catch(error => console.error('Error fetching posts or users:', error));
}

function fetchPostDetails(postId, container) {
    fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
        .then(response => response.json())
        .then(comments => {
            container.innerHTML = '<h3>Comments:</h3>';
            comments.forEach(comment => {
                const commentElement = document.createElement('div');
                commentElement.classList.add('comment');
                commentElement.innerHTML = `
                    <p><strong>${comment.name}</strong> (${comment.email})</p>
                    <p>${comment.body}</p>
                `;
                container.appendChild(commentElement);
            });
            container.classList.toggle('visible');
        })
        .catch(error => console.error('Error fetching comments:', error));
}
