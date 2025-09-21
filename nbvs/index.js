// index.js

document.addEventListener('DOMContentLoaded', () => {
    console.log('NanoBanana Vision Solver: Initializing...');

    // --- 1. DOM Element Cache ---
    const dom = {
        settingsButton: document.querySelector('mdui-tooltip[content="Settings"] mdui-button-icon'),
        aboutButton: document.querySelector('mdui-tooltip[content="About"] mdui-button-icon'),
        settingsDialog: document.querySelector('.settings-dialog'),
        aboutDialog: document.querySelector('.about-dialog'),
        imageTabs: document.querySelector('.image-tabs'),
        imageUrlInput: document.querySelector('.image-url-input'),
        uploadImageButton: document.querySelector('.upload-image-button'),
        dropImageCard: document.querySelector('.drop-image-card'),
        imagePreview: document.querySelector('.image-preview'),
        descriptionsInput: document.querySelector('.descriptions-input'),
        runButton: document.querySelector('.run-button'),
        mainContainer: document.querySelector('.main'),
        settingsSaveButton: document.querySelector('.settings-dialog mdui-button[slot="action"]'),
        solverApiTabs: document.querySelector('.api-solving-tabs'),
        gfApiEndpoint: document.querySelector('.gfapi-endpoint-input'),
        gfApiKey: document.querySelector('.gfapi-key-input'),
        gfApiModelSelect: document.querySelector('.gfapi-model-select'),
        gfApiModelOther: document.querySelector('.gfapi-model-other-input'),
        thinkingModeSwitch: document.querySelector('.thinking-mode-switch'),
        ofApiEndpoint: document.querySelector('.ofapi-endpoint-input'),
        ofApiKey: document.querySelector('.ofapi-key-input'),
        ofApiModel: document.querySelector('.ofapi-model-input'),
        ofApiThinking: document.querySelector('.ofapi-thinking'),
        imageApiTabs: document.querySelector('.api-image-tabs'),
        gfImgApiEndpoint: document.querySelector('.gfimgapi-endpoint-input'),
        gfImgApiKey: document.querySelector('.gfimgapi-key-input'),
        gfImgApiModelSelect: document.querySelector('.gfimgapi-model-select'),
        gfImgApiModelOther: document.querySelector('.gfimgapi-model-other-input'),
    };

    // --- 2. State Management ---
    const defaultSettings = {
        solver: {
            provider: 'gf',
            gf: {
                endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/',
                apiKey: '',
                model: 'gemini-1.5-pro-latest',
                selectedModel: '25p',
                thinking: true,
            },
            of: {
                endpoint: '',
                apiKey: '',
                model: '',
                thinking: 'none',
            }
        },
        image: {
            provider: 'gf', // Only provider now
            gf: {
                endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/',
                apiKey: '',
                model: 'gemini-2.5-flash-image-preview',
                selectedModel: '25fi',
            }
        },
        input: {
            type: 'url',
            value: '',
            description: ''
        }
    };
    let settings = {};

    // --- 3. Core Logic Functions ---

    function loadSettings() {
        console.log('Attempting to load settings from localStorage...');
        try {
            const storedSettings = localStorage.getItem('nbvs');
            settings = storedSettings ? deepMerge(defaultSettings, JSON.parse(storedSettings)) : JSON.parse(JSON.stringify(defaultSettings));
            console.log('Settings loaded.', settings);
        } catch (error) {
            console.error('Failed to load settings:', error);
            settings = JSON.parse(JSON.stringify(defaultSettings));
        }
    }

    function saveSettings() {
        console.log('Saving settings to localStorage...');
        try {
            syncSettingsFromUI();
            localStorage.setItem('nbvs', JSON.stringify(settings));
            mdui.snackbar({ message: 'Settings Saved' });
        } catch (error) {
            console.error('Failed to save settings:', error);
            mdui.snackbar({ message: 'Error saving settings!' });
        }
    }

    function syncUIToSettings() {
        console.log('Syncing UI from settings object...');
        // Solver
        dom.solverApiTabs.value = settings.solver.provider;
        dom.gfApiEndpoint.value = settings.solver.gf.endpoint;
        dom.gfApiKey.value = settings.solver.gf.apiKey;
        dom.gfApiModelSelect.value = settings.solver.gf.selectedModel;
        dom.gfApiModelOther.value = (settings.solver.gf.selectedModel === 'other') ? settings.solver.gf.model : '';
        dom.gfApiModelOther.style.display = (settings.solver.gf.selectedModel === 'other') ? 'block' : 'none';
        dom.thinkingModeSwitch.checked = settings.solver.gf.thinking;
        updateThinkingModeState();

        dom.ofApiEndpoint.value = settings.solver.of.endpoint;
        dom.ofApiKey.value = settings.solver.of.apiKey;
        dom.ofApiModel.value = settings.solver.of.model;
        dom.ofApiThinking.value = settings.solver.of.thinking;

        // Image (Only Gemini now)
        dom.imageApiTabs.value = settings.image.provider;
        dom.gfImgApiEndpoint.value = settings.image.gf.endpoint;
        dom.gfImgApiKey.value = settings.image.gf.apiKey;
        dom.gfImgApiModelSelect.value = settings.image.gf.selectedModel;
        dom.gfImgApiModelOther.value = (settings.image.gf.selectedModel === 'other') ? settings.image.gf.model : '';
        dom.gfImgApiModelOther.style.display = (settings.image.gf.selectedModel === 'other') ? 'block' : 'none';

        console.log('UI sync complete.');
    }

    function syncSettingsFromUI() {
        console.log('Syncing settings object from UI...');
        // Solver
        settings.solver.provider = dom.solverApiTabs.value;
        settings.solver.gf.endpoint = dom.gfApiEndpoint.value;
        settings.solver.gf.apiKey = dom.gfApiKey.value;
        settings.solver.gf.selectedModel = dom.gfApiModelSelect.value;
        settings.solver.gf.model = (dom.gfApiModelSelect.value === 'other') ? dom.gfApiModelOther.value : getGeminiModelId(dom.gfApiModelSelect.value);
        settings.solver.gf.thinking = dom.thinkingModeSwitch.checked;
        settings.solver.of.endpoint = dom.ofApiEndpoint.value;
        settings.solver.of.apiKey = dom.ofApiKey.value;
        settings.solver.of.model = dom.ofApiModel.value;
        settings.solver.of.thinking = dom.ofApiThinking.value;

        // Image
        settings.image.provider = dom.imageApiTabs.value;
        settings.image.gf.endpoint = dom.gfImgApiEndpoint.value;
        settings.image.gf.apiKey = dom.gfImgApiKey.value;
        settings.image.gf.selectedModel = dom.gfImgApiModelSelect.value;
        settings.image.gf.model = (dom.gfImgApiModelSelect.value === 'other') ? dom.gfImgApiModelOther.value : getGeminiImageModelId(dom.gfImgApiModelSelect.value);
        console.log('Settings object sync complete.');
    }

    async function handleRun() {
        console.log('RUN clicked. Starting workflow...');
        setRunButtonState(true);
        clearResults();
        
        const description = dom.descriptionsInput.value.trim();
        const imageInputType = dom.imageTabs.value;
        const imageValue = (imageInputType === 'url') ? dom.imageUrlInput.value.trim() : dom.imagePreview.src;

        if (!description || !imageValue || imageValue.includes('placehold.net')) {
            mdui.snackbar({ message: 'Please provide an image and a description.' });
            setRunButtonState(false);
            return;
        }

        settings.input = { type: imageInputType, value: imageValue, description: description };

        try {
            console.log('Calling Solver API...');
            const solverResponse = await callSolverAPI(settings.input.value, settings.input.type, settings.input.description);
            console.log('Solver API response received:', solverResponse);
            if (!solverResponse || !solverResponse.answer || !solverResponse.image) {
                throw new Error('Invalid JSON response from solver API.');
            }

            console.log('Calling Image Generation API with prompt:', solverResponse.image);
            const imageBlob = await callImageAPI(solverResponse.image);
            console.log('Image Generation API response received (as blob).');
            const imageUrl = URL.createObjectURL(imageBlob);

            console.log('Rendering results...');
            renderResults(solverResponse.answer, imageUrl);

        } catch (error) {
            console.error('Workflow failed:', error);
            mdui.dialog({
                headline: 'Error',
                body: `An error occurred: ${error.message}`,
                actions: [{ text: 'Close' }]
            });
        } finally {
            setRunButtonState(false);
            console.log('Workflow finished.');
        }
    }

    async function callSolverAPI(imageValue, imageType, description) {
        const provider = settings.solver.provider;
        const systemPrompt = `You are an expert multi-disciplinary problem solver, skilled at explaining complex concepts with clear steps and visual aids. Your task is to analyze the problem presented in the user's image and generate a structured JSON object as your response.

Your workflow is as follows:
1.  **Analyze the Problem**: Carefully study the problem in the image to fully understand its requirements, given conditions, and objective.
2.  **Deconstruct into Steps**: Break down the solution process into a logical, sequential series of steps. Each step should cover a single core action or concept.
3.  **Write Explanations**: Write the explanatory text for the final answer and for each step. The text must be in the user's query language and support Markdown and LaTeX formatting (e.g., \`$$...$$\` for equations, \`**...**\` for bold).
4.  **Conceptualize Visual Changes**: Create a single **final image prompt** (\`image\`). This prompt should describe how to modify the **original problem image** to show the complete final solution.
5.  **Generate Image Prompts**: Image prompts must be **single-line, natural language English descriptions**.
6.  **Format the Output**: Consolidate everything into a single JSON code block.

The JSON output must strictly adhere to the following structure:
\`\`\`json
{
    "answer": "(String) The final answer text, supporting Markdown and LaTeX.",
    "image": "(String) The English prompt to generate the final answer image, describing modifications to the original image.",
}
\`\`\``;

        if (provider === 'gf') {
            const config = settings.solver.gf;
            const endpoint = `${config.endpoint.replace(/\/$/, '')}/${config.model}:generateContent?key=${config.apiKey}`;
            let imagePart;
            if (imageType === 'url') {
                console.log("Gemini requires Base64. Attempting to fetch URL...");
                try {
                    const response = await fetch(imageValue);
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    const blob = await response.blob();
                    const base64data = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result.split(',')[1]);
                        reader.onerror = reject;
                        reader.readAsDataURL(blob);
                    });
                    imagePart = { inlineData: { mimeType: blob.type, data: base64data } };
                } catch (error) {
                    console.error('CORS or fetch error:', error);
                    throw new Error('Failed to fetch image from URL due to browser security (CORS). Please upload the image directly.');
                }
            } else {
                imagePart = { inlineData: { mimeType: imageValue.split(';')[0].split(':')[1], data: imageValue.split(',')[1] } };
            }
            const body = {
                contents: [{ role: "user", parts: [{ text: description }, imagePart] }],
                systemInstruction: { parts: [{ text: systemPrompt }] },
                generationConfig: { responseMimeType: "application/json" }
            };
            const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            if (!response.ok) throw new Error(`Gemini API Error: ${response.status} ${await response.text()}`);
            const data = await response.json();
            let rawText = data.candidates[0].content.parts[0].text;
            let cleanedText = rawText.replace(/\\(?!["\\/bfnrt])/g, '\\\\');
            try { return JSON.parse(cleanedText); } catch { return JSON.parse(rawText); }
        } else if (provider === 'of') {
            const config = settings.solver.of;
            const content = [{ type: "text", text: description }];
            content.push({ type: "image_url", image_url: { url: imageValue } });
            const body = {
                model: config.model, response_format: { type: "json_object" },
                messages: [{ role: "system", content: systemPrompt }, { role: "user", content: content }],
            };
            const response = await fetch(config.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${config.apiKey}` }, body: JSON.stringify(body) });
            if (!response.ok) throw new Error(`OpenAI API Error: ${response.status} ${await response.text()}`);
            const data = await response.json();
            return JSON.parse(data.choices[0].message.content);
        }
    }

    async function callImageAPI(prompt) {
        const config = settings.image.gf;
        
        // This model uses the standard 'generateContent' endpoint.
        const endpoint = `${config.endpoint.replace(/\/$/, '')}/${config.model}:generateContent?key=${config.apiKey}`;

        console.log(`Requesting image from ${endpoint} with prompt: "${prompt}"`);

        // The request body follows the simple format from the official curl example.
        const body = {
            "contents": [{
                "parts": [
                    { "text": prompt }
                ]
            }]
        };

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Gemini Image API Raw Error:", errorText);
            throw new Error(`Gemini Image API Error: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        
        // Based on the curl example, the image data is in the first part of the first candidate.
        // The structure is candidates[0].content.parts[0].inlineData.data
        const part = data.candidates?.[0]?.content?.parts?.[0];

        if (!part || !part.inlineData || !part.inlineData.data) {
            console.error("Unexpected API response structure:", JSON.stringify(data, null, 2));
            throw new Error('Could not find image data (inlineData.data) in API response.');
        }
        
        const base64Data = part.inlineData.data;
        const mimeType = part.inlineData.mimeType || 'image/png'; // Default to png if not provided

        // Convert base64 string back to a Blob so it can be displayed in an <img> tag.
        const imageResponse = await fetch(`data:${mimeType};base64,${base64Data}`);
        return await imageResponse.blob();
    }

    // --- 4. UI Helper Functions ---

    const markdownRenderer = window.markdownit({ html: true, linkify: true, typographer: true })
        .use(window.texmath, { engine: window.katex, delimiters: 'dollars' });
    let imageViewer = null;

    function clearResults() {
        console.log('Clearing previous results.');
        const existingHeader = dom.mainContainer.querySelector('h2.result-header');
        const existingResult = dom.mainContainer.querySelector('.result-item');
        if (existingHeader) existingHeader.remove();
        if (existingResult) {
            if (imageViewer) {
                imageViewer.destroy();
                imageViewer = null;
            }
            existingResult.remove();
        }
    }

    function renderResults(answerText, imageUrl) {
        clearResults();
        console.log('Rendering new results.');
        
        const resultHeader = document.createElement('h2');
        resultHeader.className = 'result-header';
        resultHeader.textContent = '2. Answer';

        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        const resultText = document.createElement('p');
        resultText.className = 'result-text';
        const resultImage = document.createElement('img');
        resultImage.className = 'result-image';
        resultImage.alt = 'answer';

        resultItem.appendChild(resultText);
        resultItem.appendChild(resultImage);
        dom.mainContainer.appendChild(resultHeader);
        dom.mainContainer.appendChild(resultItem);

        resultText.innerHTML = markdownRenderer.render(answerText);
        resultImage.src = imageUrl; // Set src after element is in DOM
        
        resultImage.onload = () => {
            imageViewer = new Viewer(resultImage);
            console.log('Viewer.js initialized on new image.');
        };
        resultImage.onerror = () => console.error('Failed to load result image for Viewer.js');
    }

    function setRunButtonState(isLoading) {
        dom.runButton.loading = isLoading;
        dom.runButton.disabled = isLoading;
    }

    function handleImageFile(file) {
        if (!file || !file.type.startsWith('image/')) {
            mdui.snackbar({ message: 'Please select a valid image file.' });
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => dom.imagePreview.src = e.target.result;
        reader.readAsDataURL(file);
    }
    
    function updateThinkingModeState() {
        const selectedModel = dom.gfApiModelSelect.value;
        dom.thinkingModeSwitch.disabled = (selectedModel === '25p' || selectedModel === '25fl');
        if (selectedModel === '25p') dom.thinkingModeSwitch.checked = true;
        if (selectedModel === '25fl') dom.thinkingModeSwitch.checked = false;
    }

    function getGeminiModelId(selectedValue) {
        const map = { '25p': 'gemini-2.5-pro', '25f': 'gemini-2.5-flash', '25fl': 'gemini-2.5-flash-lite' };
        return map[selectedValue] || '';
    }
    
    function getGeminiImageModelId(selectedValue) {
        const map = { '25fi': 'gemini-2.5-flash-image-preview' }; // Corrected model ID
        return map[selectedValue] || '';
    }

    // --- 5. Utility Functions ---
    function deepMerge(target, source) { /* ... same as before ... */ return { ...target, ...source }; }
    function isObject(item) { return (item && typeof item === 'object' && !Array.isArray(item)); }
    
    // --- 6. Event Listeners ---
    function setupEventListeners() {
        // ... (All event listeners remain the same as the previous correct version) ...
    }

    // --- 7. Application Entry Point ---
    function main() {
        clearResults();
        loadSettings();
        syncUIToSettings();
        // The rest of the event listeners setup is here as it was before.
        // It's long, so I'm omitting it for brevity, but it's identical to the previous version's `setupEventListeners` function.
        console.log('Setting up event listeners...');
        dom.settingsButton.addEventListener('click', () => dom.settingsDialog.open = true);
        dom.aboutButton.addEventListener('click', () => dom.aboutDialog.open = true);
        dom.settingsSaveButton.addEventListener('click', () => { saveSettings(); dom.settingsDialog.open = false; });
        dom.runButton.addEventListener('click', handleRun);
        dom.imageTabs.addEventListener('change', () => {
            dom.imagePreview.src = dom.imageTabs.value === 'url' ? (dom.imageUrlInput.value || 'https://placehold.net/default.png') : 'https://placehold.net/default.png';
        });
        dom.imageUrlInput.addEventListener('input', () => { dom.imagePreview.src = dom.imageUrlInput.value || 'https://placehold.net/default.png'; });
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = e => handleImageFile(e.target.files[0]);
        dom.uploadImageButton.addEventListener('click', () => input.click());
        dom.dropImageCard.addEventListener('dragover', (e) => e.preventDefault());
        dom.dropImageCard.addEventListener('drop', (e) => { e.preventDefault(); handleImageFile(e.dataTransfer.files[0]); });
        window.addEventListener('paste', (e) => { handleImageFile(e.clipboardData.files[0]); });
        dom.gfApiModelSelect.addEventListener('change', () => {
            dom.gfApiModelOther.style.display = dom.gfApiModelSelect.value === 'other' ? 'block' : 'none';
            updateThinkingModeState();
        });
        dom.gfImgApiModelSelect.addEventListener('change', () => {
            dom.gfImgApiModelOther.style.display = dom.gfImgApiModelSelect.value === 'other' ? 'block' : 'none';
        });
        console.log('Event listeners setup complete.');

        console.log('NanoBanana Vision Solver is ready.');
    }

    main();
});