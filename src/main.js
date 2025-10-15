import './style.css'

  
        // ===============================
        // SISTEMA DE ALMACENAMIENTO
        // ===============================
        // TODO: Integrar Firebase/Supabase aquí
        // Para autenticación y sincronización en la nube
        
        class NotesStorage {
            constructor() {
                this.storageKey = 'nebula_notes';
            }

            getNotes() {
                const data = localStorage.getItem(this.storageKey);
                return data ? JSON.parse(data) : this.getDefaultNotes();
            }

            saveNotes(notes) {
                localStorage.setItem(this.storageKey, JSON.stringify(notes));
            }

            getDefaultNotes() {
                return [
                    { id: 1, text: 'Mi primer pensamiento cósmico...', drawing: null, date: new Date().toISOString() },
                    { id: 2, text: 'Gratitud del día...', drawing: null, date: new Date().toISOString() },
                    { id: 3, text: 'Metas para mañana...', drawing: null, date: new Date().toISOString() },
                    { id: 4, text: 'Reflexión nocturna...', drawing: null, date: new Date().toISOString() }
                ];
            }
        }

        const storage = new NotesStorage();
        let notes = storage.getNotes();
        let currentNoteId = null;
        let isDrawing = false;
        let canvas, ctx;

        // ===============================
        // SISTEMA DE TEMAS
        // ===============================
        
        const themeToggle = document.getElementById('themeToggle');
        let currentTheme = 'el'; // 'el' o 'ella'

        themeToggle.addEventListener('click', () => {
            currentTheme = currentTheme === 'el' ? 'ella' : 'el';
            document.documentElement.setAttribute('data-theme', currentTheme);
            themeToggle.textContent = currentTheme === 'el' ? '🌙' : '🌸';
        });

        // ===============================
        // RENDERIZADO DE NOTAS
        // ===============================
        
        function renderNotes() {
            const container = document.getElementById('notesContainer');
            container.innerHTML = '';

            notes.forEach(note => {
                const card = document.createElement('div');
                card.className = 'star-card rounded-3xl p-6 shadow-2xl cursor-pointer';
                card.onclick = () => openModal(note.id);

                const preview = note.text.substring(0, 80) + (note.text.length > 80 ? '...' : '');
                const hasDrawing = note.drawing ? '🎨' : '';

                card.innerHTML = `
                    <div class="flex items-center gap-2 mb-3">
                        <span class="text-2xl">⭐</span>
                        <h3 class="text-lg font-semibold">Estrella #${note.id}</h3>
                        <span class="ml-auto">${hasDrawing}</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-2">${preview}</p>
                    <p class="text-xs text-gray-500">${new Date(note.date).toLocaleDateString()}</p>
                `;

                container.appendChild(card);
            });

            // Actualizar contador
            document.getElementById('noteCount').textContent = notes.length;
        }

        // ===============================
        // MODAL Y CANVAS
        // ===============================
        
        function openModal(noteId) {
            currentNoteId = noteId;
            const note = notes.find(n => n.id === noteId);
            
            document.getElementById('noteText').value = note.text;
            document.getElementById('editModal').classList.remove('hidden');
            document.getElementById('editModal').classList.add('flex');

            // Inicializar canvas
            canvas = document.getElementById('drawingCanvas');
            ctx = canvas.getContext('2d');
            
            // Restaurar dibujo si existe
            if (note.drawing) {
                const img = new Image();
                img.onload = () => ctx.drawImage(img, 0, 0);
                img.src = note.drawing;
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }

            setupCanvas();
        }

        function closeModal() {
            document.getElementById('editModal').classList.add('hidden');
            document.getElementById('editModal').classList.remove('flex');
            currentNoteId = null;
        }

        function setupCanvas() {
            const brushColor = document.getElementById('brushColor');
            const brushSize = document.getElementById('brushSize');

            canvas.addEventListener('mousedown', startDrawing);
            canvas.addEventListener('mousemove', draw);
            canvas.addEventListener('mouseup', stopDrawing);
            canvas.addEventListener('mouseout', stopDrawing);

            // Touch support
            canvas.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                const mouseEvent = new MouseEvent('mousedown', {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
                canvas.dispatchEvent(mouseEvent);
            });

            canvas.addEventListener('touchmove', (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                const mouseEvent = new MouseEvent('mousemove', {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
                canvas.dispatchEvent(mouseEvent);
            });

            canvas.addEventListener('touchend', (e) => {
                e.preventDefault();
                const mouseEvent = new MouseEvent('mouseup', {});
                canvas.dispatchEvent(mouseEvent);
            });

            function startDrawing(e) {
                isDrawing = true;
                const rect = canvas.getBoundingClientRect();
                ctx.beginPath();
                ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
            }

            function draw(e) {
                if (!isDrawing) return;
                const rect = canvas.getBoundingClientRect();
                ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
                ctx.strokeStyle = brushColor.value;
                ctx.lineWidth = brushSize.value;
                ctx.lineCap = 'round';
                ctx.stroke();
            }

            function stopDrawing() {
                isDrawing = false;
            }
        }

        function clearCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        // ===============================
        // CRUD DE NOTAS
        // ===============================
        
        function saveNote() {
            const note = notes.find(n => n.id === currentNoteId);
            note.text = document.getElementById('noteText').value;
            note.drawing = canvas.toDataURL();
            note.date = new Date().toISOString();

            storage.saveNotes(notes);
            renderNotes();
            closeModal();

            // Animación de guardado
            showNotification('✨ Estrella guardada en tu nébula');
        }

        function deleteNote() {
            if (confirm('¿Eliminar esta estrella de tu nébula?')) {
                notes = notes.filter(n => n.id !== currentNoteId);
                storage.saveNotes(notes);
                renderNotes();
                closeModal();
                showNotification('🌑 Estrella eliminada');
            }
        }

        function addNote() {
            const newId = Math.max(...notes.map(n => n.id), 0) + 1;
            notes.push({
                id: newId,
                text: '',
                drawing: null,
                date: new Date().toISOString()
            });
            storage.saveNotes(notes);
            renderNotes();
            openModal(newId);
        }

        // ===============================
        // CAMBIO DE IMAGEN CENTRAL
        // ===============================
        // TODO: Integrar con un servicio de upload (Cloudinary, Firebase Storage)
        
        function changeImage() {
            const urls = [
                'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=400&fit=crop'
            ];
            const randomUrl = urls[Math.floor(Math.random() * urls.length)];
            document.getElementById('centralImage').src = randomUrl;

            // Para permitir upload del usuario:
            // 1. Agregar: <input type="file" id="imageUpload" accept="image/*" style="display:none">
            // 2. En changeImage(): document.getElementById('imageUpload').click()
            // 3. Manejar el evento change para subir a Firebase Storage
        }

        // ===============================
        // NOTIFICACIONES
        // ===============================
        
        function showNotification(message) {
            const notification = document.createElement('div');
            notification.className = 'fixed top-24 right-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-2xl shadow-2xl z-50 animate-bounce';
            notification.textContent = message;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transition = 'opacity 0.5s';
                setTimeout(() => notification.remove(), 500);
            }, 2000);
        }

        // ===============================
        // INICIALIZACIÓN
        // ===============================
        
        renderNotes();
