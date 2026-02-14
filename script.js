// Mobile Menu Functionality - Must be at the top to work on all pages
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navCenter = document.querySelector('.nav-center');
    const body = document.body;
    
    if (menuToggle && navCenter) {
        // Toggle mobile menu
        menuToggle.addEventListener('click', function() {
            navCenter.classList.toggle('mobile-active');
            body.classList.toggle('menu-open');
            
            // Change hamburger icon to X when menu is open
            const icon = menuToggle.querySelector('i');
            if (icon) {
                if (navCenter.classList.contains('mobile-active')) {
                    icon.className = 'fas fa-times';
                } else {
                    icon.className = 'fas fa-bars';
                }
            }
        });
        
        // Close menu when clicking on a link
        const navLinks = navCenter.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navCenter.classList.remove('mobile-active');
                body.classList.remove('menu-open');
                
                // Reset hamburger icon
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-bars';
                }
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navCenter.contains(e.target) && !menuToggle.contains(e.target)) {
                navCenter.classList.remove('mobile-active');
                body.classList.remove('menu-open');
                
                // Reset hamburger icon
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-bars';
                }
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navCenter.classList.contains('mobile-active')) {
                navCenter.classList.remove('mobile-active');
                body.classList.remove('menu-open');
                
                // Reset hamburger icon
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-bars';
                }
            }
        });
    }
});

// Admin password (loaded from environment variable)
const ADMIN_PASSWORD = 'YOUR_ADMIN_PASSWORD';

// Supabase configuration - Replace with your new project URL and anon key (see SUPABASE_SETUP.md)
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_KEY';

let supabase = null;
if (window.supabase) {
    // Keys are now defined above
    if (supabaseUrl && supabaseKey) {
        supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
    }
}

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const adminLink = document.getElementById('adminLink');
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const closeModal = document.querySelector('.close');
const adminControls = document.getElementById('adminControls');
const newslettersList = document.getElementById('newslettersList');
const newsletterForm = document.getElementById('newsletterForm');
const fileInput = document.getElementById('pdfFile');
const subscriptionForm = document.getElementById('subscriptionForm');
const adminNavBtn = document.getElementById('adminNavBtn');

// Debug logs - Only log if Supabase is available
if (supabase) {
    console.log('Supabase client:', supabase);
}
console.log('DOM Elements:', {
    loginBtn,
    loginModal,
    loginForm,
    closeModal,
    fileInput
});

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('isAdmin') === 'true';
}

// Update UI based on login status
function updateUI() {
    const isAdmin = isLoggedIn();
    
    if (adminNavBtn) {
        if (isAdmin) {
            adminNavBtn.textContent = 'LOGOUT';
        } else {
            adminNavBtn.textContent = 'ADMIN';
        }
    }

    if (loginBtn) loginBtn.style.display = isAdmin ? 'none' : 'block';
    if (logoutBtn) logoutBtn.style.display = isAdmin ? 'block' : 'none';
    if (adminLink) adminLink.style.display = isAdmin ? 'block' : 'none';
    if (adminControls) adminControls.style.display = isAdmin ? 'block' : 'none';

    const eventsAdminWrap = document.getElementById('eventsAdminWrap');
    if (eventsAdminWrap) {
        eventsAdminWrap.style.display = isAdmin ? 'block' : 'none';
    }
}

// Show login modal
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        if (loginModal) {
            loginModal.style.display = 'block';
        }
    });
}

// Close login modal
if (closeModal) {
    closeModal.addEventListener('click', () => {
        if (loginModal) {
            loginModal.style.display = 'none';
        }
    });
}

// Close modal when clicking outside
if (loginModal) {
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });
}

// Handle login form submission
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = document.getElementById('password').value;
        
        if (password === ADMIN_PASSWORD) {
            localStorage.setItem('isAdmin', 'true');
            if (loginModal) {
                loginModal.style.display = 'none';
            }
            updateUI();
            // Redirect to admin page on successful login
            window.location.href = 'admin.html';
        } else {
            alert('Invalid password');
        }
    });
}

// Handle Admin Nav Button
if (adminNavBtn) {
    adminNavBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (isLoggedIn()) {
            // LOGOUT
            localStorage.removeItem('isAdmin');
            updateUI();
            if (window.location.pathname.endsWith('admin.html')) {
                window.location.href = 'index.html';
            }
        } else {
            // LOGIN
            if (loginModal) {
                loginModal.style.display = 'block';
            }
        }
    });
}

// Handle newsletter form submission
if (newsletterForm) {
    const dropZone = document.getElementById('dropZone');

    if (dropZone) {
        // Drag and drop functionality
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropZone.classList.add('highlight'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropZone.classList.remove('highlight'), false);
        });

        dropZone.addEventListener('drop', handleDrop, false);

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            if(fileInput) fileInput.files = files;
            updateFileName(files[0]);
        }
    }

    function updateFileName(file) {
        const fileNameDisplay = document.getElementById('fileName');
        if (fileNameDisplay) {
            fileNameDisplay.textContent = file ? file.name : 'No file selected';
        }
    }

    function updateCoverFileName(file) {
        const coverFileNameDisplay = document.getElementById('coverFileName');
        if (coverFileNameDisplay) {
            coverFileNameDisplay.textContent = file ? file.name : 'No cover image selected';
        }
    }

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            updateFileName(e.target.files[0]);
        });
    }

    const coverFileInput = document.getElementById('coverFile');
    if (coverFileInput) {
        coverFileInput.addEventListener('change', (e) => {
            updateCoverFileName(e.target.files[0]);
        });
    }

    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!isLoggedIn()) {
            alert('Please log in first');
            return;
        }

        if (!supabase) {
            alert('Database connection not available. Please try again later.');
            return;
        }

        const title = document.getElementById('title').value;
        const date = document.getElementById('date').value;
        const preview = document.getElementById('preview').value;
        const pdfFile = document.getElementById('pdfFile').files[0];
        const coverFile = document.getElementById('coverFile') ? document.getElementById('coverFile').files[0] : null;
        
        if (!pdfFile) {
            alert('Please select a PDF file');
            return;
        }

        // Show loading state
        const submitButton = newsletterForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Uploading...';

        try {
            // Upload PDF to Supabase Storage
            const fileName = `${Date.now()}-${pdfFile.name}`;
            const { error: uploadError } = await supabase.storage
                .from('newsletters')
                .upload(fileName, pdfFile);

            if (uploadError) throw uploadError;

            // Get the public URL for the uploaded file
            const { data: { publicUrl } } = supabase.storage
                .from('newsletters')
                .getPublicUrl(fileName);

            // Upload cover image if provided
            let coverUrl = null;
            if (coverFile) {
                const coverFileName = `${Date.now()}-${coverFile.name}`;
                const { error: coverError } = await supabase.storage
                    .from('newsletter-covers')
                    .upload(coverFileName, coverFile, { upsert: false });
                if (coverError) throw coverError;
                const { data: { publicUrl: coverPublicUrl } } = supabase.storage
                    .from('newsletter-covers')
                    .getPublicUrl(coverFileName);
                coverUrl = coverPublicUrl;
            }

            // Create newsletter record in Supabase database
            const { error: dbError } = await supabase
                .from('newsletters')
                .insert([
                    {
                        title,
                        date,
                        preview,
                        pdf_url: publicUrl,
                        cover_url: coverUrl,
                        created_at: new Date().toISOString()
                    }
                ]);

            if (dbError) throw dbError;

            alert('Newsletter uploaded successfully!');
            
            newsletterForm.reset();
            updateFileName(null);
            updateCoverFileName(null);

            window.location.href = 'newsletters.html';
        } catch (error) {
            alert('Failed to upload newsletter. Error: ' + (error.message || error));
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}

// Display newsletters
async function displayNewsletters() {
    if (!newslettersList) return;
    
    if (!supabase) {
        newslettersList.innerHTML = '<p>Database connection not available. Please try refreshing the page.</p>';
        return;
    }
    
    try {
        const { data: newsletters, error } = await supabase
            .from('newsletters')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        
        if (newsletters.length === 0) {
            newslettersList.innerHTML = '<p>No newsletters have been posted yet. Check back soon!</p>';
            return;
        }

        let html = '';
        const isAdmin = isLoggedIn();

        for (const newsletter of newsletters) {
            const coverHtml = newsletter.cover_url
                ? `<a href="${newsletter.pdf_url}" target="_blank" class="newsletter-cover-link"><img src="${newsletter.cover_url}" alt="${newsletter.title}" class="newsletter-cover-img"></a>`
                : '';
            html += `
                <div class="newsletter-card" id="newsletter-${newsletter.id}">
                    <div class="newsletter-card-inner">
                        ${coverHtml}
                        <div class="newsletter-info">
                            <h3>${newsletter.title}</h3>
                            <p class="date">${new Date(newsletter.date).toLocaleDateString()}</p>
                            <p>${newsletter.preview}</p>
                            <a href="${newsletter.pdf_url}" target="_blank" class="btn">Read More</a>
                        </div>
                    </div>
                </div>
            `;
        }
        newslettersList.innerHTML = html;
    } catch (error) {
        newslettersList.innerHTML = '<p class="error">Failed to load newsletters. Please try refreshing the page.</p>';
        console.error('Error fetching newsletters:', error);
    }
}

// Handle subscription form submission
if (subscriptionForm) {
    subscriptionForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!supabase) {
            const messageEl = document.getElementById('subscriptionMessage');
            if (messageEl) {
                messageEl.textContent = 'Subscription service not available. Please try again later.';
                messageEl.style.color = 'red';
            }
            return;
        }

        const email = document.getElementById('subscriberEmail').value;
        const messageEl = document.getElementById('subscriptionMessage');

        if (messageEl) {
            messageEl.textContent = 'Subscribing...';
            messageEl.style.color = '#333';
        }

        try {
            const { error } = await supabase
                .from('subscribers')
                .insert([{ email: email, created_at: new Date().toISOString() }]);

            if (error) {
                if (error.code === '23505') { 
                    throw new Error('This email address is already subscribed.');
                }
                throw error;
            }

            if (messageEl) {
                messageEl.textContent = 'Thank you for subscribing!';
                messageEl.style.color = 'green';
            }
            subscriptionForm.reset();

        } catch (error) {
            if (messageEl) {
                messageEl.textContent = `Subscription failed: ${error.message}`;
                messageEl.style.color = 'red';
            }
        } finally {
            if (messageEl) {
                setTimeout(() => {
                    messageEl.textContent = '';
                }, 5000);
            }
        }
    });
}

// --- Events (homepage) ---
async function displayEvents() {
    const eventsList = document.getElementById('eventsList');
    if (!eventsList) return;

    if (!supabase) {
        eventsList.innerHTML = '<p class="events-message">Events cannot be loaded right now. Refresh the page later.</p>';
        return;
    }

    try {
        const { data: events, error } = await supabase
            .from('events')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (!events || events.length === 0) {
            eventsList.innerHTML = '<p class="events-message">No upcoming events right now. Check back soon!</p>';
            return;
        }

        const isAdmin = isLoggedIn();
        let html = '';
        for (const event of events) {
            const imgHtml = event.image_url
                ? `<img src="${event.image_url}" alt="${event.title}" class="event-item-img">`
                : '';
            const linkHtml = event.link_url
                ? `<p><a href="${event.link_url}" target="_blank" rel="noopener" class="event-item-link">RSVP / Learn more</a></p>`
                : '';
            const deleteBtn = '';
            html += `
                <div class="event-item" id="event-${event.id}">
                    ${imgHtml}
                    <div class="event-item-body">
                        <h3 class="event-item-title">${event.title}</h3>
                        <p class="event-item-date">${event.event_date}</p>
                        <p class="event-item-desc">${event.description}</p>
                        ${linkHtml}
                        ${deleteBtn}
                    </div>
                </div>
            `;
        }
        eventsList.innerHTML = html;

        eventsList.querySelectorAll('.btn-event-delete').forEach(btn => {
            btn.addEventListener('click', handleDeleteEvent);
        });
    } catch (err) {
        eventsList.innerHTML = '<p class="events-message">Failed to load events. Please try again later.</p>';
        console.error('Error loading events:', err);
    }
}

async function handleDeleteEvent(e) {
    const btn = e.target;
    const id = btn.getAttribute('data-event-id');
    if (!id || !confirm('Delete this event?')) return;
    if (!supabase) return;
    try {
        const { error } = await supabase.from('events').delete().eq('id', id);
        if (error) throw error;
        const el = document.getElementById('event-' + id);
        if (el) el.remove();
        const list = document.getElementById('eventsList');
        if (list && list.querySelectorAll('.event-item').length === 0) {
            list.innerHTML = '<p class="events-message">No upcoming events right now. Check back soon!</p>';
        }
    } catch (err) {
        alert('Failed to delete event: ' + (err.message || err));
    }
}

function initEventsForm() {
    const wrap = document.getElementById('eventsAdminWrap');
    const form = document.getElementById('eventForm');
    const toggleBtn = document.getElementById('toggleAddEventBtn');
    const cancelBtn = document.getElementById('cancelEventFormBtn');
    if (!form || !toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
        const show = form.style.display === 'none';
        form.style.display = show ? 'block' : 'none';
    });
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            form.style.display = 'none';
            form.reset();
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!isLoggedIn() || !supabase) {
            alert('You must be logged in to add events.');
            return;
        }
        const title = document.getElementById('eventTitle').value.trim();
        const event_date = document.getElementById('eventDate').value.trim();
        const description = document.getElementById('eventDescription').value.trim();
        const link_url = document.getElementById('eventLink').value.trim() || null;
        const image_url = document.getElementById('eventImageUrl').value.trim() || null;
        try {
            const { error } = await supabase.from('events').insert([{
                title,
                event_date,
                description,
                link_url,
                image_url,
                created_at: new Date().toISOString()
            }]);
            if (error) throw error;
            form.reset();
            form.style.display = 'none';
            displayEvents();
        } catch (err) {
            alert('Failed to create event: ' + (err.message || err));
        }
    });
}

// Link the latest volume on the homepage and set its cover image
async function linkLatestVolume() {
    const latestVolumeLink = document.getElementById('latestVolumeLink');
    const latestVolumeImg = document.getElementById('latestVolumeImg');
    if (!latestVolumeLink) return; // Only run on index.html

    if (!supabase) {
        console.log('Supabase not available for latest volume link');
        return;
    }

    try {
        const { data, error } = await supabase
            .from('newsletters')
            .select('pdf_url, cover_url')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error) throw error;

        if (data && data.pdf_url) {
            latestVolumeLink.href = data.pdf_url;
            latestVolumeLink.target = '_blank';
            if (latestVolumeImg) {
                if (data.cover_url) {
                    latestVolumeImg.src = data.cover_url;
                    latestVolumeImg.alt = 'Latest newsletter';
                }
            }
        } else {
            latestVolumeLink.href = '#';
            latestVolumeLink.removeAttribute('target');
            latestVolumeLink.onclick = (e) => {
                e.preventDefault();
                alert('No newsletters have been published yet.');
            };
        }
    } catch (error) {
        console.error('Error fetching latest newsletter:', error);
        latestVolumeLink.href = '#';
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Page Protection
    if (window.location.pathname.endsWith('/admin.html') && !isLoggedIn()) {
        alert('You must be logged in to view this page.');
        window.location.href = 'index.html';
        return; // Stop further execution
    }

    updateUI();
    displayNewsletters();
    displayEvents();
    initEventsForm();
    linkLatestVolume();
});