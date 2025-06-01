// Audio input and processing
class AudioProcessor {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.microphone = null;
        this.isInitialized = false;
        this.audioSource = 'mic'; // 'mic' or 'system'
        this.dataArray = null;
        this.bufferLength = 0;
    }

    async init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            
            // Configure analyser
            this.analyser.fftSize = 256;
            this.bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(this.bufferLength);
            
            // Set up microphone input by default
            await this.setupMicrophone();
            
            this.isInitialized = true;
            console.log('Audio processor initialized');
            return true;
        } catch (error) {
            console.error('Error initializing audio processor:', error);
            return false;
        }
    }

    async setupMicrophone() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.microphone = this.audioContext.createMediaStreamSource(stream);
            this.microphone.connect(this.analyser);
            // Don't connect to destination to avoid feedback
            console.log('Microphone input set up successfully');
            this.audioSource = 'mic';
            return true;
        } catch (error) {
            console.error('Error accessing microphone:', error);
            return false;
        }
    }

    async setupSystemAudio() {
        try {
            // This is a placeholder as direct system audio capture requires additional permissions
            // and may not be available in all browsers
            alert('System audio capture is not fully supported in all browsers. Please use microphone input or place your microphone near your speakers.');
            
            // In a real implementation, you might use browser-specific APIs or extensions
            // For now, we'll just use the microphone as a fallback
            await this.setupMicrophone();
            this.audioSource = 'system';
            return true;
        } catch (error) {
            console.error('Error accessing system audio:', error);
            return false;
        }
    }

    getAudioData() {
        if (!this.isInitialized) return null;
        
        this.analyser.getByteFrequencyData(this.dataArray);
        return this.dataArray;
    }

    getAverageVolume() {
        if (!this.isInitialized) return 0;
        
        const data = this.getAudioData();
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
            sum += data[i];
        }
        return sum / data.length;
    }

    getBassLevel() {
        if (!this.isInitialized) return 0;
        
        const data = this.getAudioData();
        let sum = 0;
        // Use first ~20% of frequency bins for bass
        const bassRange = Math.floor(data.length * 0.2);
        for (let i = 0; i < bassRange; i++) {
            sum += data[i];
        }
        return sum / bassRange;
    }

    getMidLevel() {
        if (!this.isInitialized) return 0;
        
        const data = this.getAudioData();
        let sum = 0;
        // Use middle ~60% of frequency bins for mids
        const midStart = Math.floor(data.length * 0.2);
        const midEnd = Math.floor(data.length * 0.8);
        for (let i = midStart; i < midEnd; i++) {
            sum += data[i];
        }
        return sum / (midEnd - midStart);
    }

    getHighLevel() {
        if (!this.isInitialized) return 0;
        
        const data = this.getAudioData();
        let sum = 0;
        // Use last ~20% of frequency bins for highs
        const highStart = Math.floor(data.length * 0.8);
        for (let i = highStart; i < data.length; i++) {
            sum += data[i];
        }
        return sum / (data.length - highStart);
    }

    toggleAudioSource() {
        if (this.audioSource === 'mic') {
            this.setupSystemAudio();
        } else {
            this.setupMicrophone();
        }
        return this.audioSource;
    }
}

// Export the audio processor
const audioProcessor = new AudioProcessor();
