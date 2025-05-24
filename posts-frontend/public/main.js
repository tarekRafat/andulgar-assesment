const apiUrl = 'http://localhost:3000/posts';

document.addEventListener('DOMContentLoaded', () => {
    fetchPosts();
    document.getElementById('postForm').addEventListener('submit', createPost);
});

function fetchPosts() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(posts => {
            const postsList = document.getElementById('postsList');
            postsList.innerHTML = '';
            posts.forEach(post => {
                const li = document.createElement('li');
                li.textContent = post.title;
                li.appendChild(createEditButton(post));
                li.appendChild(createDeleteButton(post.id));
                postsList.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching posts:', error));
}

// ...existing code...

function createPost(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const postId = document.getElementById('postId').value;

    const method = postId ? 'PUT' : 'POST';
    const url = postId ? `${apiUrl}/${postId}` : apiUrl;

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content })
    })
    .then(response => response.json())
    .then(() => {
        fetchPosts();
        document.getElementById('postForm').reset();
        document.getElementById('postId').value = '';
    })
    .catch(error => console.error('Error saving post:', error));
}

function editPost(post) {
    document.getElementById('title').value = post.title;
    document.getElementById('content').value = post.content;
    document.getElementById('postId').value = post.id;
}

// ...existing code...

function createEditButton(post) {
    const button = document.createElement('button');
    button.textContent = 'Edit';
    button.onclick = () => editPost(post);
    return button;
}

function createDeleteButton(postId) {
    const button = document.createElement('button');
    button.textContent = 'Delete';
    button.onclick = () => deletePost(postId);
    return button;
}

function deletePost(postId) {
    fetch(`${apiUrl}/${postId}`, {
        method: 'DELETE'
    })
    .then(() => fetchPosts())
    .catch(error => console.error('Error deleting post:', error));
}