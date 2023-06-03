import { ErrorHandler, Injectable } from "@angular/core";
import { Observable, Subscriber } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class RecordingService {

    private audioStream: MediaStream | null = null;

    private mediaRecorderInstance: MediaRecorder | null = null;

    private audioBlobs: Blob[] = [];

    constructor() {}

    /**
     * 
     * @returns 
     */
    public checkRecordingPossible(): boolean {
        //Feature Detection
        if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
            //Feature is not supported in browser
            //return a custom error
            return false
        }
        return true;
    }

    /**
     * 
     * @returns 
     */
    public stopRecording(): Observable<Blob> {
        return new Observable( observer => {
            if(!this.mediaRecorderInstance || !this.audioStream) {
                observer.error("No recording is in progress");
                return;
            }
            const mimeType = this.mediaRecorderInstance.mimeType;

            this.mediaRecorderInstance.addEventListener("stop", () => {
                //create a single blob object, as we might have gathered a few Blob objects that needs to be joined as one
                const audioBlob = new Blob(this.audioBlobs, { type: mimeType });

                //resolve promise with the single audio blob representing the recorded audio
                observer.next(audioBlob);
            });

            this.mediaRecorderInstance.stop();
            this.stopSteams(this.audioStream);
            this.resetValues();
        })
    }

    /**
     * 
     * @returns 
     */
    public cancelRecording() {
        if(!this.mediaRecorderInstance || !this.audioStream) {
            return;
        }
        this.mediaRecorderInstance.stop();
        this.stopSteams(this.audioStream);
        this.resetValues();
    }

    /**
     * 
     */
    private resetValues() {
        this.audioStream = null;
        this.mediaRecorderInstance = null;
        this.audioBlobs = []
    }

    /**
     * 
     * @returns 
     */
    public startVoiceRecording(): Observable<{type:string, value: number}> {
        return new Observable((observer) => {
            this.startRecording().then(stream => {
                this.audioStream = stream;
                
                this.initializeVoiceDetection(stream, observer);
                this.startMediaRecording(this.audioStream);
                observer.next({type: "status", value: 1});
            }).catch(error => {
                this.handleRecordingStartError(error);
                observer.error("Unable to start recording.");
                observer.complete();
            })
        });
    }

    private initializeVoiceDetection(stream: MediaStream, observer: Subscriber<{type:string, value: number}>) {
      const audioContext = new AudioContext();
        // Create a MediaStreamAudioSourceNode from the microphone stream
      const source = audioContext.createMediaStreamSource(stream);

      //audioContext.audioWorklet.addModule('voice-detector-processor.js').then(() => {
      //const workletNode = new AudioWorkletNode(audioContext, 'voice-detector-processor');

      const analyserNode = audioContext.createAnalyser();

      source.connect(analyserNode);
     

      setInterval(() => {
        const dataArray = new Uint8Array(analyserNode.frequencyBinCount);
        analyserNode.getByteTimeDomainData(dataArray);

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
            const amplitude = (dataArray[i] - 128) / 128;
            sum += Math.abs(amplitude);
        }
        
        console.log((sum / dataArray.length))
        const averageAmplitude = this.scaleValue(((sum / dataArray.length) * 10), 0, 1, 0, 100);
        console.log(averageAmplitude)

        observer.next({type: "voice_detection", value: averageAmplitude})
      }, 200)
    }

    private startRecording() {
        return navigator.mediaDevices.getUserMedia({ audio: true });
    }

    private startMediaRecording(stream: MediaStream) {
        this.mediaRecorderInstance = new MediaRecorder(stream, {} as MediaRecorderOptions);
        this.mediaRecorderInstance.addEventListener("dataavailable", event => {
            //store audio Blob object
            this.audioBlobs.push(event.data);
        });

        //start the recording by calling the start method on the media recorder
        this.mediaRecorderInstance.start();
    }

    private handleRecordingStartError(error:any) {
        if(!error) {
            console.log("error occurred during recording")
            return;
        }
              
        console.log("To record audio, use browsers like Chrome and Firefox.");
        //Error handling structure
        switch (error.name) {
            case 'AbortError': //error from navigator.mediaDevices.getUserMedia
                console.log("An AbortError has occurred.");
                break;
            case 'NotAllowedError': //error from navigator.mediaDevices.getUserMedia
                console.log("A NotAllowedError has occurred. User might have denied permission.");
                break;
            case 'NotFoundError': //error from navigator.mediaDevices.getUserMedia
                console.log("A NotFoundError has occurred.");
                break;
            case 'NotReadableError': //error from navigator.mediaDevices.getUserMedia
                console.log("A NotReadableError has occurred.");
                break;
            case 'SecurityError': //error from navigator.mediaDevices.getUserMedia or from the MediaRecorder.start
                console.log("A SecurityError has occurred.");
                break;
            case 'TypeError': //error from navigator.mediaDevices.getUserMedia
                console.log("A TypeError has occurred.");
                break;
            case 'InvalidStateError': //error from the MediaRecorder.start
                console.log("An InvalidStateError has occurred.");
                break;
            case 'UnknownError': //error from the MediaRecorder.start
                console.log("An UnknownError has occurred.");
                break;
            default:
                console.log("An error occurred with the error name " + error.name);
        };
    }

    /**
     * 
     * @param audioStreams 
     */
    private stopSteams(audioStreams: MediaStream) {
        //stopping the capturing request by stopping all the tracks on the active stream
        audioStreams.getTracks() //get all tracks from the stream
                    .forEach(track => track.stop()); //stop each one
    }

    private scaleValue(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
        // Calculate the input and output ranges
        const inRange = inMax - inMin;
        const outRange = outMax - outMin;
      
        // Scale the value to the output range
        const scaledValue = (value - inMin) * (outRange / inRange) + outMin;
      
        return scaledValue;
      }
}