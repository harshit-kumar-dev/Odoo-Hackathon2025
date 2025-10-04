        // Tailwind Configuration for the futuristic theme
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        'space-dark': '#0D1117',
                        'space-mid': '#161B22',
                        'space-light': '#21262D',
                        'neon-teal': '#00F0FF', // Primary Accent
                        'neon-violet': '#7F00FF', // Secondary Accent
                    },
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                    },
                    keyframes: {
                        'glow': {
                            '0%, 100%': { boxShadow: '0 0 5px rgba(0, 240, 255, 0.4), 0 0 10px rgba(0, 240, 255, 0.2)' },
                            '50%': { boxShadow: '0 0 15px rgba(0, 240, 255, 0.6), 0 0 25px rgba(0, 240, 255, 0.4)' },
                        }
                    },
                    animation: {
                        'neon-glow': 'glow 3s ease-in-out infinite',
                    }
                }
            }
        }
    

        
        document.addEventListener('DOMContentLoaded', () => {
            const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
            const mobileMenu = document.getElementById('mobile-menu');
            const navLinks = document.querySelectorAll('.nav-link');
            const authModal = document.getElementById('auth-modal');
            const loginBtns = document.querySelectorAll('#login-btn-desktop, #login-btn-mobile');
            const signupBtns = document.querySelectorAll('#signup-btn-desktop, #signup-btn-mobile');
            const ctaBtn = document.getElementById('cta-start-btn');
            const modalTitle = document.getElementById('modal-title');
            const submitBtn = document.getElementById('submit-btn');
            const toggleText = document.getElementById('toggle-text');
            const messageBox = document.getElementById('message-box');
            const fullNameInputGroup = document.getElementById('full-name-input-group');
            const fullNameInput = document.getElementById('full-name');
            let currentMode = 'login'; // 'login' or 'signup'

            // --- 1. Mobile Menu Toggle Logic ---
            mobileMenuToggle.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
                // Change icon for better UX
                const icon = mobileMenuToggle.querySelector('i');
                if (mobileMenu.classList.contains('hidden')) {
                    icon.classList.remove('ph-x');
                    icon.classList.add('ph-list');
                } else {
                    icon.classList.remove('ph-list');
                    icon.classList.add('ph-x');
                }
            });

            // --- 2. Smooth Scrolling for Navigation Links ---
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Close mobile menu if open
                    if (!mobileMenu.classList.contains('hidden')) {
                         mobileMenu.classList.add('hidden');
                         mobileMenuToggle.querySelector('i').classList.remove('ph-x');
                         mobileMenuToggle.querySelector('i').classList.add('ph-list');
                    }

                    const targetId = link.getAttribute('href');
                    const targetElement = document.querySelector(targetId);

                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - document.querySelector('header').offsetHeight, // Offset by header height
                            behavior: 'smooth'
                        });
                    }
                });
            });

            // CTA button also triggers signup
            ctaBtn.addEventListener('click', () => {
                openModal('signup');
            });


            // --- 3. Modal Control Logic ---

            const openModal = (mode) => {
                currentMode = mode;
                authModal.classList.remove('hidden');
                document.body.classList.add('overflow-hidden'); // Prevent background scrolling
                updateModalUI(mode);
                messageBox.classList.add('hidden'); // Clear any previous messages
            };

            window.closeModal = (event) => {
                if (event && event.target !== authModal) return; // Only close if clicking the backdrop
                authModal.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
            };

            loginBtns.forEach(btn => btn.addEventListener('click', () => openModal('login')));
            signupBtns.forEach(btn => btn.addEventListener('click', () => openModal('signup')));


            const updateModalUI = (mode) => {
                if (mode === 'login') {
                    modalTitle.textContent = 'Access the Expenza Console';
                    submitBtn.textContent = 'Login';
                    toggleText.innerHTML = 'Don\'t have an account? <a href="#" onclick="toggleMode(event, \'signup\')" class="text-neon-violet hover:text-neon-teal font-medium transition">Sign up now</a>.';
                    fullNameInputGroup.classList.add('hidden');
                    fullNameInput.removeAttribute('required');
                } else { // signup mode
                    modalTitle.textContent = 'Launch Your Corporate OS';
                    submitBtn.textContent = 'Auto-Setup & Sign Up';
                    toggleText.innerHTML = 'Already have an Admin account? <a href="#" onclick="toggleMode(event, \'login\')" class="text-neon-violet hover:text-neon-teal font-medium transition">Login here</a>.';
                    fullNameInputGroup.classList.remove('hidden');
                    fullNameInput.setAttribute('required', 'true');
                }
            };

            window.toggleMode = (event, mode) => {
                event.preventDefault();
                updateModalUI(mode);
                currentMode = mode;
                messageBox.classList.add('hidden'); // Clear previous messages
            };

            // --- 4. Simulated Auth Handling ---
            window.handleAuth = (event) => {
                event.preventDefault();
                const email = document.getElementById('email').value;
                const action = currentMode === 'signup' ? 'Sign Up' : 'Login';

                // Display loading state
                submitBtn.textContent = `....`;
                submitBtn.disabled = true;

                // Simulate API call delay
                setTimeout(() => {
                    submitBtn.textContent = action;
                    submitBtn.disabled = false;

                    let successMessage = '';
                    if (currentMode === 'signup') {
                        // Simulated Company/Admin Creation Process
                        const fullName = fullNameInput.value;
                        successMessage = `🚀 Success! Welcome, ${fullName}. Your Company and Admin user have been auto-created. Redirecting to the Setup Dashboard...`;
                    } else {
                        successMessage = `✅ Success! Logging in Admin (${email}). Redirecting to the main console...`;
                    }

                    messageBox.textContent = successMessage;
                    messageBox.classList.remove('hidden');

                    // Optional: Close modal after a delay and refresh page (simulating redirection)
                    setTimeout(() => {
                         // document.getElementById('auth-form').reset();
                         // closeModal(); // Don't close, let the user see the success message
                         // For a real app, this is where window.location.href would change.
                    }, 3000);

                }, 1500); // 1.5 seconds delay
            };
        });

