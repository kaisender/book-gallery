// ========== CONFIGURACIÓN DE GITHUB GIST ==========
let GIST_ID = "";
let GITHUB_TOKEN = "";
const GIST_FILENAME = "gallery-db.json";


// ========== CACHÉ LOCAL PARA VELOCIDAD ==========
function getCachedGallery() {
    const cached = localStorage.getItem('cachedGallery');
    return cached ? JSON.parse(cached) : null;
}

function setCachedGallery(gallery) {
    localStorage.setItem('cachedGallery', JSON.stringify(gallery));
}

// Modificar la función getGallery existente:
async function getGallery(useCache = true) {
    if (!GIST_ID) {
        await loadConfig();
    }
    
    // Devolver caché inmediatamente si existe
    if (useCache) {
        const cached = getCachedGallery();
        if (cached) {
            // Actualizar en segundo plano
            updateGalleryCache();
            return cached;
        }
    }
    
    if (!GIST_ID || !GITHUB_TOKEN) {
        console.error('Credenciales no disponibles');
        return [];
    }
    
    try {
        const response = await fetch(`https://api.github.com/gists/${GIST_ID}`);
        
        if (!response.ok) {
            console.error('Error en GitHub API:', response.status);
            return [];
        }
        
        const gist = await response.json();
        const content = gist.files[GIST_FILENAME].content;
        const gallery = JSON.parse(content);
        const result = Array.isArray(gallery) ? gallery : [];
        
        // Guardar en caché
        setCachedGallery(result);
        
        return result;
    } catch (error) {
        console.error('Error al obtener galería:', error);
        return getCachedGallery() || [];
    }
}

// Función para actualizar caché en background
async function updateGalleryCache() {
    try {
        const gallery = await getGallery(false); // Sin usar caché
        setCachedGallery(gallery);
    } catch (error) {
        console.error('Error actualizando caché:', error);
    }
}


// Cargar configuración desde Netlify
async function loadConfig() {
    try {
        const response = await fetch('/.netlify/functions/get-config');
        const text = await response.text();
        
        // Ejecutar el código JavaScript que viene de la función
        eval(text);
        
        GIST_ID = window.CONFIG.GIST_ID;
        GITHUB_TOKEN = window.CONFIG.GITHUB_TOKEN;
        
        console.log('Config cargada correctamente');
    } catch (error) {
        console.error('Error cargando configuración:', error);
        alert('Error al cargar configuración. Revisa las variables de entorno en Netlify.');
    }
}

// Obtener galería desde Gist
async function getGallery() {
    if (!GIST_ID) {
        await loadConfig();
    }
    
    if (!GIST_ID || !GITHUB_TOKEN) {
        console.error('Credenciales no disponibles');
        return [];
    }
    
    try {
        const response = await fetch(`https://api.github.com/gists/${GIST_ID}`);
        
        if (!response.ok) {
            console.error('Error en GitHub API:', response.status);
            return [];
        }
        
        const gist = await response.json();
        const content = gist.files[GIST_FILENAME].content;
        const gallery = JSON.parse(content);
        
        // Asegurarse de que es un array
        return Array.isArray(gallery) ? gallery : [];
    } catch (error) {
        console.error('Error al obtener galería:', error);
        return [];
    }
}

// Agregar entrada a la galería
async function addToGallery(item) {
    if (!GIST_ID) {
        await loadConfig();
    }
    
    try {
        const gallery = await getGallery();
        gallery.push(item);
        
        const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                files: {
                    [GIST_FILENAME]: {
                        content: JSON.stringify(gallery, null, 2)
                    }
                }
            })
        });
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error al agregar a galería:', error);
        throw error;
    }
}

// Eliminar entrada de la galería
async function deleteFromGallery(index) {
    if (!GIST_ID) {
        await loadConfig();
    }
    
    try {
        const gallery = await getGallery();
        gallery.splice(index, 1);
        
        const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                files: {
                    [GIST_FILENAME]: {
                        content: JSON.stringify(gallery, null, 2)
                    }
                }
            })
        });
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error al eliminar:', error);
        throw error;
    }
}

// ========== FUNCIONES DE USUARIOS (localStorage) ==========
function getUsers() {
    const data = localStorage.getItem('users');
    return data ? JSON.parse(data) : [];
}

function getCurrentUser() {
    const data = localStorage.getItem('currentUser');
    return data ? JSON.parse(data) : null;
}

// ========== FUNCIONES DE USUARIOS EN GIST ==========
const USERS_FILENAME = "users-db.json";

async function getUsers() {
    if (!GIST_ID) await loadConfig();
    
    try {
        const response = await fetch(`https://api.github.com/gists/${GIST_ID}`);
        const gist = await response.json();
        const content = gist.files[USERS_FILENAME].content;
        return JSON.parse(content);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        return [];
    }
}

async function addUser(user) {
    if (!GIST_ID) await loadConfig();
    
    try {
        const users = await getUsers();
        users.push(user);
        
        const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                files: {
                    [USERS_FILENAME]: {
                        content: JSON.stringify(users, null, 2)
                    }
                }
            })
        });
        
        return await response.json();
    } catch (error) {
        console.error('Error al agregar usuario:', error);
        throw error;
    }
}

function getCurrentUser() {
    const data = localStorage.getItem('currentUser');
    return data ? JSON.parse(data) : null;
}

