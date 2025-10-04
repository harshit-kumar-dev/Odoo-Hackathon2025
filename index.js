    // Tailwind Configuration for the futuristic theme
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        'space-dark': '#0D1117', // Near-Black Background
                        'space-mid': '#161B22', // Slightly Lighter Background
                        'space-light': '#21262D', // Border/Divider Color
                        'neon-teal': '#00F0FF', // Primary Accent (Bright Cyan)
                        'neon-violet': '#7F00FF', // Secondary Accent (Electric Purple)
                    },
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                    },
                    keyframes: {
                        'glow': {
                            // Enhanced glow for the primary accent
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
            
            // Input groups and elements
            const fullNameInputGroup = document.getElementById('full-name-input-group');
            const fullNameInput = document.getElementById('full-name');
            const confirmPasswordInputGroup = document.getElementById('confirm-password-input-group');
            const confirmPasswordInput = document.getElementById('confirm-password');
            const countryInputGroup = document.getElementById('country-input-group');
            const countryInput = document.getElementById('country');
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');

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
                        const icon = mobileMenuToggle.querySelector('i');
                        icon.classList.remove('ph-x');
                        icon.classList.add('ph-list');
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
                // Reset form fields
                document.getElementById('auth-form').reset();

                if (mode === 'login') {
                    modalTitle.textContent = 'Access the Expenza Console';
                    submitBtn.textContent = 'Login';
                    toggleText.innerHTML = 'Don\'t have an account? <a href="#" onclick="toggleMode(event, \'signup\')" class="text-neon-violet hover:text-neon-teal font-medium transition">Sign up now</a>.';
                    
                    // Hide signup-specific fields
                    fullNameInputGroup.classList.add('hidden');
                    confirmPasswordInputGroup.classList.add('hidden');
                    countryInputGroup.classList.add('hidden');
                    
                    // Remove required attributes (for browser validation)
                    fullNameInput.removeAttribute('required');
                    confirmPasswordInput.removeAttribute('required');
                    countryInput.removeAttribute('required');
                    
                    // Set login required fields (already in HTML, but good practice)
                    emailInput.setAttribute('required', 'true');
                    passwordInput.setAttribute('required', 'true');

                } else { // signup mode
                    modalTitle.textContent = 'Launch Your Corporate OS';
                    submitBtn.textContent = 'Auto-Setup & Sign Up';
                    toggleText.innerHTML = 'Already have an Admin account? <a href="#" onclick="toggleMode(event, \'login\')" class="text-neon-violet hover:text-neon-teal font-medium transition">Login here</a>.';
                    
                    // Show signup-specific fields
                    fullNameInputGroup.classList.remove('hidden');
                    confirmPasswordInputGroup.classList.remove('hidden');
                    countryInputGroup.classList.remove('hidden');
                    
                    // Add required attributes for all signup fields
                    fullNameInput.setAttribute('required', 'true');
                    confirmPasswordInput.setAttribute('required', 'true');
                    countryInput.setAttribute('required', 'true');
                    emailInput.setAttribute('required', 'true');
                    passwordInput.setAttribute('required', 'true');
                }
            };

            window.toggleMode = (event, mode) => {
                event.preventDefault();
                updateModalUI(mode);
                currentMode = mode;
                messageBox.classList.add('hidden'); // Clear previous messages
            };

            // --- 4. Simulated Auth Handling (ERRORS CORRECTED HERE) ---
            window.handleAuth = (event) => {
                event.preventDefault();
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const action = currentMode === 'signup' ? 'Sign Up' : 'Login';
                
                // Reset message box
                messageBox.classList.add('hidden'); 
                
                // Password and Country validation for signup mode
                if (currentMode === 'signup') {
                    const confirmPassword = confirmPasswordInput.value;
                    const country = countryInput.value;
                    
                    if (password !== confirmPassword) {
                        messageBox.textContent = '❌ Error: Passwords do not match. Please try again.';
                        messageBox.classList.remove('hidden');
                        return; // Stop the function
                    }
                    if (country === "") {
                        messageBox.textContent = '❌ Error: Please select a country.';
                        messageBox.classList.remove('hidden');
                        return; // Stop the function
                    }
                }

                // Display loading state
                // CORRECTED: Using concatenation with '+' which is standard syntax outside of template literals.
                submitBtn.textContent = '...'; 
                submitBtn.disabled = true;

                // Simulate API call delay
                setTimeout(() => {
                    submitBtn.textContent = action;
                    submitBtn.disabled = false;

                    let successMessage = '';
                    if (currentMode === 'signup') {
                        // Simulated Company/Admin Creation Process
                        const fullName = fullNameInput.value;
                        // CORRECTED: Using concatenation with '+' signs
                        successMessage = '🚀 Success! Welcome, ' + fullName + '. Your Company and Admin user have been auto-created. Redirecting to the Setup Dashboard...';
                    } else {
                        // CORRECTED: Using concatenation with '+' signs
                        successMessage = '✅ Success! Logging in Admin (' + email + '). Redirecting to the main console...';
                    }

                    messageBox.textContent = successMessage;
                    messageBox.classList.remove('hidden');

                    // NEW: Redirect the user to the dashboard page
                    setTimeout(() => {
                        window.location.href = './admin_profile.html'; // Redirect to a new page
                    }, 2000); // Wait for 2 seconds to show the success message
                  
                }, 1500); // 1.5 seconds delay
            };
        });
