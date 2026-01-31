// ========== CONFIGURACIÓN DE GITHUB GIST ==========
// Las credenciales se cargan dinámicamente desde Netlify Functions
let GIST_ID = "";
let GITHUB_TOKEN = "";
const GIST_FILENAME = "gallery-db.json";

// Cargar configuración desde Netlify
async function loadConfig() {
    try {
        const script = document.createElement('script');
        script.src = '/.netlify/functions/get-config';
        
        return new Promise((resolve, reject) => {
            script.onload = () => {
                GIST_ID = window.CONFIG.GIST_ID;
                GITHUB_TOKEN = window.CONFIG.GITHUB_TOKEN;
                resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    } catch (error) {
        console.error('Error cargando configuración:', error);
    }
}

// Resto de las funciones igual, pero ahora serán async...
async function getGallery() {
    if (!GIST_ID) await loadConfig();
    try {
        const response = await fetch(`https://api.github.com/gists/${GIST_ID}`);
        const gist = await response.json();
        const content = gist.files[GIST_FILENAME].content;
        return JSON.parse(content);
    } catch (error) {
        console.error('Error al obtener galería:', error);
        return [];
    }
}

async function addToGallery(item) {
    if (!GIST_ID) await loadConfig();
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
        
        return await response.json();
    } catch (error) {
        console.error('Error al agregar a galería:', error);
        throw error;
    }
}

async function deleteFromGallery(index) {
    if (!GIST_ID) await loadConfig();
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
        
        return await response.json();
    } catch (error) {
        console.error('Error al eliminar:', error);
        throw error;
    }
}

// Funciones de usuarios (localStorage)
function getUsers() {
    const data = localStorage.getItem('users');
    return data ? JSON.parse(data) : [];
}

function getCurrentUser() {
    const data = localStorage.getItem('currentUser');
    return data ? JSON.parse(data) : null;
}
