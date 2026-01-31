document.addEventListener('DOMContentLoaded', () => {
    // 1. Set Domain Name
    const domainSpan = document.getElementById('domain-name');
    domainSpan.textContent = window.location.hostname || 'example.com';

    // 2. Generate Random Ray ID
    const rayIdSpan = document.getElementById('ray-id');
    const generateRayId = () => {
        const hex = '0123456789abcdef';
        let id = '';
        for (let i = 0; i < 16; i++) {
            id += hex[Math.floor(Math.random() * 16)];
        }
        return id;
    };
    rayIdSpan.textContent = generateRayId();

    // 3. Main Logic
    const checkbox = document.getElementById('cf-checkbox');
    const spinner = document.getElementById('cf-spinner');
    const successIcon = document.getElementById('cf-success');
    const errorIcon = document.getElementById('cf-error');
    const message = document.getElementById('cf-status-message');
    const label = document.querySelector('.cf-label');

    const successLinks = [
        'https://virt.moe/cferr/lutshz5',
        'https://virt.moe/cferr/y4ccst1',
        'https://virt.moe/cferr/s92rc5d',
        'https://virt.moe/cferr/uktdr2n',
        'https://virt.moe/cferr/s9vprul'
    ];

    const triggerSuccess = () => {
        spinner.style.display = 'none';
        errorIcon.style.display = 'none';
        successIcon.style.display = 'flex';
        label.textContent = 'Success!';
        
        setTimeout(() => {
            const randomLink = successLinks[Math.floor(Math.random() * successLinks.length)];
            window.location.href = randomLink;
        }, 500);
    };

    const triggerError = () => {
        spinner.style.display = 'none';
        errorIcon.style.display = 'flex';
        label.textContent = 'Verification failed';
        message.textContent = 'Please refresh the page.';
        
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    };

    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            // Hide checkbox visually
            checkbox.classList.add('hidden');
            
            // Show spinner
            spinner.style.display = 'block';
            label.textContent = 'Verifying...';
            
            // Random delay between 30 and 100 seconds (30000 - 100000 ms)
            const delay = Math.floor(Math.random() * (100000 - 30000 + 1)) + 30000;
            
            setTimeout(() => {
                const isError = Math.random() < 0.75; // 75% probability
                if (isError) {
                    triggerError();
                } else {
                    triggerSuccess();
                }
            }, delay);
        }
    });

    // 4. Cheat Code (Konami Code: ↑↑↓↓←→←→BA)
    const konamiCode = [
        'ArrowUp', 'ArrowUp', 
        'ArrowDown', 'ArrowDown', 
        'ArrowLeft', 'ArrowRight', 
        'ArrowLeft', 'ArrowRight', 
        'b', 'a'
    ];
    let keySequence = [];

    document.addEventListener('keydown', (e) => {
        keySequence.push(e.key);
        // Keep sequence length equal to konami code length
        if (keySequence.length > konamiCode.length) {
            keySequence.shift();
        }

        if (JSON.stringify(keySequence) === JSON.stringify(konamiCode)) {
            // Trigger immediate success
            // Force visual state if not already started
            checkbox.checked = true; 
            // If cheat is entered, cancel any pending operations? 
            // Ideally we just overwrite the UI state and redirect immediately.
            spinner.style.display = 'block'; // Briefly show spinner maybe?
            setTimeout(() => {
                triggerSuccess();
            }, 300); // Small delay for effect
        }
    });
});
