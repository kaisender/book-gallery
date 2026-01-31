// Funciones para manejar galería
function getGallery() {
    const data = localStorage.getItem('bookGallery');
    return data ? JSON.parse(data) : [];
}

function addToGallery(item) {
    const gallery = getGallery();
    gallery.push(item);
    localStorage.setItem('bookGallery', JSON.stringify(gallery));
}

function clearGallery() {
    localStorage.removeItem('bookGallery');
}

// Funciones para manejar usuarios
function getUsers() {
    const data = localStorage.getItem('users');
    return data ? JSON.parse(data) : [];
}

function getCurrentUser() {
    const data = localStorage.getItem('currentUser');
    return data ? JSON.parse(data) : null;
}
